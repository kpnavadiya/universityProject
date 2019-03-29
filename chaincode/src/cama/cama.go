
package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"strconv"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"
)

type SmartContract struct {
}

type Film struct {
	Name   string `json:"name"`
	Year  string `json:"year"`
	Budget string `json:"budget"`
	Copyrights  string `json:"copyrights"`
}

type FilmProfit{
     Profit string `json:"profit"`

}

func (s *SmartContract) Init(APIstub shim.ChaincodeStubInterface) sc.Response {
	return shim.Success(nil)
}

func (s *SmartContract) Invoke(APIstub shim.ChaincodeStubInterface) sc.Response {

     function, args := APIstub.GetFunctionAndParameters()
	
	if function == "queryFilm" {
		return s.queryFilm(APIstub, args)
	} else if function == "initLedger" {
		return s.initLedger(APIstub)
	} else if function == "createFilm" {
		return s.createFilm(APIstub, args)
	} else if function == "queryAllFilms" {
		return s.queryAllFilms(APIstub)
	} else if function == "deleteFilm" {       
			return s.deleteFilm(APIstub, args)	
	} else if function == "changeCopyrights" {
		return s.changeCopyrights(APIstub, args)
	}

	return shim.Error("Invalid Smart Contract function name.")
}

func (s *SmartContract) queryFilm(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting atleast 1 argument")
	}

	filmAsBytes, _ := APIstub.GetState(args[0])
	return shim.Success(filmAsBytes)
}

func (s *SmartContract) initLedger(APIstub shim.ChaincodeStubInterface) sc.Response {
	films := []Film{
		Film{Name: "Spidermn", Year: "2011", Budget: "$2000", Copyrights: "Mahesh"},
		Film{Name: "Terminator", Year: "1999", Budget: "$5000", Copyrights: "Suresh"},
		Film{Name: "Hancock", Year: "2022", Budget: "$3000", Copyrights: "Naresh"},
		Film{Name: "The Avengers", Year: "2011", Budget: "$4000", Copyrights: "Ganesh"},
	}

	i := 0
	for i < len(films) {
		fmt.Println("i is ", i)
		filmAsBytes, _ := json.Marshal(films[i])
		APIstub.PutState("FILM"+strconv.Itoa(i), filmAsBytes)
		fmt.Println("Added", films[i])
		i = i + 1
	}

	return shim.Success(nil)
}

func (s *SmartContract) createFilm(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 5 {
		return shim.Error("Incorrect number of arguments. Expecting 5")
	}

	var film =  Film	
	             {
					Name: args[1], 
					Year: args[2], 
					Budget: args[3], 
					Copyrights: args[4]
				}
    var profit = Profit{
                         Profit: args[5]
	                    }

	filmAsBytes, _ := json.Marshal(film)
	APIstub.PutState(args[0], filmAsBytes)

	profitAsBytes,_ := json.Marshal(profit)

	return shim.Success(nil)
}

func (s *SmartContract) queryAllFilms(APIstub shim.ChaincodeStubInterface) sc.Response {

	startKey := "FILM0"
	endKey := "FILM999"

	resultsIterator, err := APIstub.GetStateByRange(startKey, endKey)
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()

	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}
		
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"Key\":")
		buffer.WriteString("\"")
		buffer.WriteString(queryResponse.Key)
		buffer.WriteString("\"")

		buffer.WriteString(", \"Record\":")
		
		buffer.WriteString(string(queryResponse.Value))
		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	fmt.Printf("- queryAllFilms:\n%s\n", buffer.String())

	return shim.Success(buffer.Bytes())
}

func (s *SmartContract) changeCopyrights(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}

	filmAsBytes, _ := APIstub.GetState(args[0])
	film := Film{}

	json.Unmarshal(filmAsBytes, &film)
	film.Copyrights = args[1]

	filmAsBytes, _ = json.Marshal(film)
	APIstub.PutState(args[0], filmAsBytes)

	return shim.Success(nil)
}

func (s *SmartContract) deleteFilm(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting at least 1 argument")
	}

	film := args[0]

	err := APIstub.DelState(film)
	if err != nil {
		return shim.Error("Failed to delete the film")
	}

	return shim.Success(nil)
}

func main() {

	err := shim.Start(new(SmartContract))
	if err != nil {
		fmt.Printf("Error creating new Smart Contract: %s", err)
	}
}

