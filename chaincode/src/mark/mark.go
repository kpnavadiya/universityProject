package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	//"strconv"
	//"strings"
	//"time"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

// MarksheetChaincode example simple Chaincode implementation
type MarksheetChaincode struct {
}

type Marksheet struct {
	//ObjectType  string `json:"docType"` //docType is used to distinguish the various types of objects in state database
	MarksheetId string `json:"MarksheetId"`
	EnrolNo     string `json:"EnrolNo"`
	Name        string `json:"Name"`    //the fieldtags are needed to keep case from bouncing around
	Samester    string `json:"Samester"`
	ExamType    string `json:"ExamType"`
	Cgpa        string `json:"Cgpa"`
}

// ===================================================================================
// Main
// ===================================================================================
func main() {
	err := shim.Start(new(MarksheetChaincode))
	if err != nil {
		fmt.Printf("Error starting Simple chaincode: %s", err)
	}
}

// Init initializes chaincode
// ===========================
func (t *MarksheetChaincode) Init(stub shim.ChaincodeStubInterface) pb.Response {
	fmt.Println("chaincode init sucsess!!! ")
	return shim.Success(nil)
}

// Invoke - Our entry point for Invocations
// ========================================
func (t *MarksheetChaincode) Invoke(stub shim.ChaincodeStubInterface) pb.Response {
	function, args := stub.GetFunctionAndParameters()
	fmt.Println("invoke is running " + function)

	// Handle different functions
	if function == "createMarksheet" { //create a new marble
		return t.createMarksheet(stub, args)
	} else if function == "queryMarksheet" { //read a marble
		return t.queryMarksheet(stub, args)
	} else if function == "queryMarksheetByEnrolNo" { //find marbles for owner X using rich query
		return t.queryMarksheetByEnrolNo(stub, args)
	} 
	fmt.Println("invoke did not find func: " + function) //error
	return shim.Error("Received unknown function invocation")
}

// ============================================================
// initMarksheet - create a new marksheet, store into chaincode state
// ============================================================
func (t *MarksheetChaincode) createMarksheet(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	var err error

	//   0       1    2    3	 4  		5
	// 	"1"	,"102", "kp", "6", "remedial", "6.3"
	if len(args) != 6 {
		return shim.Error("Incorrect number of arguments. Expecting 5")
	}
	//==== Input sanitation ====
	fmt.Println("- start init marksheet")
	if len(args[0]) <= 0 {
		return shim.Error("1st argument must be a non-empty string")
	}
	if len(args[1]) <= 0 {
		return shim.Error("2nd argument must be a non-empty string")
	}
	if len(args[2]) <= 0 {
		return shim.Error("3rd argument must be a non-empty string")
	}
	if len(args[3]) <= 0 {
		return shim.Error("4th argument must be a non-empty string")
	}
	if len(args[4]) <= 0 {
		return shim.Error("5th argument must be a non-empty string")
	}
	if len(args[5]) <= 0 {
		return shim.Error("6th argument must be a non-empty string")
	}
	// ==== Create marksheet object and marshal to JSON ====
	

	var marksheet = Marksheet{MarksheetId: args[0],EnrolNo: args[1], Name: args[2], Samester: args[3], ExamType: args[4], Cgpa: args[5]}
	
	// Check if allready that key is present
	marksheetAsBytes, err := stub.GetState(args[0])
	if err != nil {
		   return shim.Error("failed to get marksheet!!!" + err.Error())
	} else if marksheetAsBytes != nil {
		   fmt.Println("This key already exists: " + args[0])
		   return shim.Error("This key already exists: " + args[0])
	}
	// Store data
	marksheetStoreAsBytes, _ := json.Marshal(marksheet)
	err1 := stub.PutState(args[0], marksheetStoreAsBytes)
	if err1 != nil {
		   return shim.Error(fmt.Sprintf("failed to record marksheet data !!! %s", args[0]))
	}
	
	return shim.Success(nil)
}

// ===============================================
// readMarksheet - read a marksheet from chaincode state
// ===============================================
func (t *MarksheetChaincode) queryMarksheet(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	var id, jsonResp string
	var err error

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting name of the marble to query")
	}

	id = args[0]
	valAsbytes, err := stub.GetState(id) //get the marksheet from chaincode state
	if err != nil {
		jsonResp = "{\"Error\":\"Failed to get state for " + id + "\"}"
		return shim.Error(jsonResp)
	} else if valAsbytes == nil {
		jsonResp = "{\"Error\":\"Marksheet does not exist: " + id + "\"}"
		return shim.Error(jsonResp)
	}

	return shim.Success(valAsbytes)
}

func (t *MarksheetChaincode) queryMarksheetByEnrolNo(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	if len(args) < 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	queryString := args[0]

	queryResults, err := getQueryResultForQueryString(stub, queryString)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(queryResults)
}

// =========================================================================================
// getQueryResultForQueryString executes the passed in query string.
// Result set is built and returned as a byte array containing the JSON results.
// =========================================================================================
func getQueryResultForQueryString(stub shim.ChaincodeStubInterface, queryString string) ([]byte, error) {

	fmt.Printf("- getQueryResultForQueryString queryString:\n%s\n", queryString)

	resultsIterator, err := stub.GetQueryResult(queryString)
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	buffer, err := constructQueryResponseFromIterator(resultsIterator)
	if err != nil {
		return nil, err
	}

	fmt.Printf("- getQueryResultForQueryString queryResult:\n%s\n", buffer.String())

	return buffer.Bytes(), nil
}
// ===========================================================================================
// constructQueryResponseFromIterator constructs a JSON array containing query results from
// a given result iterator
// ===========================================================================================
func constructQueryResponseFromIterator(resultsIterator shim.StateQueryIteratorInterface) (*bytes.Buffer, error) {
	// buffer is a JSON array containing QueryResults
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}
		// Add a comma before array members, suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"Key\":")
		buffer.WriteString("\"")
		buffer.WriteString(queryResponse.Key)
		buffer.WriteString("\"")

		buffer.WriteString(", \"Record\":")
		// Record is a JSON object, so we write as-is
		buffer.WriteString(string(queryResponse.Value))
		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	return &buffer, nil
}
