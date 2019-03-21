package main

import (
	"encoding/json"
	"fmt"
	"strconv"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

type film struct {
	FilmId     string `json:"filmId"`
	FilmName   string `json:"filmName"`
	Director   string `json:"director"`
	Copyrights string `json:"copyrights"`
}

type filmNetworth struct {
	FilmId        string  `json:"filmId"`
	Budget        float64 `json:"budget"`
	CurrentProfit float64 `json:"currentProfit"`
}

type camaChaincode struct {
}

func main() {

	err := shim.Start(new(camaChaincode))

	if err != nil {
		fmt.Printf("Error starting the cama Contract: %s", err)
	}

}

func (t *camaChaincode) Init(stub shim.ChaincodeStubInterface) pb.Response {

	fmt.Println("Successfully init chaincode")

	return shim.Success(nil)

}

func (t *camaChaincode) Invoke(stub shim.ChaincodeStubInterface) pb.Response {

	fmt.Println("Start Invoke")
	defer fmt.Println("Stop Invoke")

	function, args := stub.GetFunctionAndParameters()

	switch function {

	case "createFilm":
		return t.createFilm(stub, args)
	case "getFilm":
		return t.getFilm(stub, args)
	case "getFilmNetworth":
		return t.getFilmNetworth(stub, args)
	default:
		return shim.Error("Invalid invoke function name.")
	}

}

func (t *camaChaincode) createFilm(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	filmId := args[0]
	filmName := args[1]
	director := args[2]
	copyrights := args[3]
	budget, err1 := strconv.ParseFloat(args[4], 32)
	currentProfit, err2 := strconv.ParseFloat(args[5], 32)

	if err1 != nil || err2 != nil {
		return shim.Error("Error parsing the values")
	}

	film := &film{filmId, filmName, director, copyrights}
	filmBytes, err3 := json.Marshal(film)

	if err3 != nil {
		return shim.Error(err1.Error())
	}

	filmNetworth := &filmNetworth{filmId, budget, currentProfit}
	filmNetworthBytes, err4 := json.Marshal(filmNetworth)

	if err4 != nil {
		return shim.Error(err2.Error())
	}

	err5 := stub.PutPrivateData("camaPublicData", filmId, filmBytes)

	if err5 != nil {
		return shim.Error(err5.Error())
	}

	err6 := stub.PutPrivateData("camaPrivateData", filmId, filmNetworthBytes)

	if err6 != nil {
		return shim.Error(err6.Error())
	}

	jsonFilm, err7 := json.Marshal(film)
	if err7 != nil {
		return shim.Error(err7.Error())
	}

	return shim.Success(jsonFilm)

}

func (t *camaChaincode) getFilm(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	filmId := args[0]
	film := film{}

	filmBytes, err1 := stub.GetPrivateData("camaPublicData", filmId)
	if err1 != nil {
		return shim.Error(err1.Error())
	}

	err2 := json.Unmarshal(filmBytes, &film)

	if err2 != nil {
		fmt.Println("Error unmarshalling object with filmid: " + filmId)
		return shim.Error(err2.Error())
	}

	jsonFilm, err3 := json.Marshal(film)
	if err3 != nil {
		return shim.Error(err3.Error())
	}

	return shim.Success(jsonFilm)

}

func (t *camaChaincode) getFilmNetworth(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	filmId := args[0]
	filmNetworth := filmNetworth{}

	filmNetworthBytes, err1 := stub.GetPrivateData("camaPrivateData", filmId)
	if err1 != nil {
		return shim.Error(err1.Error())
	}

	err2 := json.Unmarshal(filmNetworthBytes, &filmNetworth)

	if err2 != nil {
		fmt.Println("Error unmarshalling object with FilmId: " + filmId)
		return shim.Error(err2.Error())
	}

	jsonfilmNetworth, err3 := json.Marshal(filmNetworth)
	if err3 != nil {
		return shim.Error(err3.Error())
	}

	return shim.Success(jsonfilmNetworth)

}
