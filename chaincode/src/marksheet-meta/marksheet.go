/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/*
 * The sample smart contract for documentation topic:
 * Writing Your First Blockchain Application
 */

 package main

 /* Imports
  * 4 utility libraries for formatting, handling bytes, reading and writing JSON, and string manipulation
  * 2 specific Hyperledger Fabric specific libraries for Smart Contracts
  */
 import (
	 "bytes"
	 "encoding/json"
	 "fmt"
	 "strconv"
	 "strings"
	 
 
	 "github.com/hyperledger/fabric/core/chaincode/shim"
	 sc "github.com/hyperledger/fabric/protos/peer"
 )
 
 // Define the Smart Contract structure
 type SmartContract struct {
 }
 
 // Define the car structure, with 5 properties.  Structure tags are used by encoding/json library
 type Marksheet struct {
	 ObjectType string `json:"docType"`
	 Name   string `json:"name"`
	 EnrolNo  string `json:"enrolno"`
	 Exam string `json:"exam"`
	 Samester  string `json:"samester"`
	 CGPA  string `json:"cgpa"`
 }
 
 /*
  * The Init method is called when the Smart Contract "marksheet" is instantiated by the blockchain network
  * Best practice is to have any Ledger initialization in separate function -- see initLedger()
  */
 func (s *SmartContract) Init(APIstub shim.ChaincodeStubInterface) sc.Response {
	fmt.Printf("SmartContract Init................") 
	return shim.Success(nil)
 }
 
 /*
  * The Invoke method is called as a result of an application request to run the Smart Contract "Marksheet"
  * The calling application program has also specified the particular smart contract function to be called, with arguments
  */
 func (s *SmartContract) Invoke(APIstub shim.ChaincodeStubInterface) sc.Response {
 
	 // Retrieve the requested Smart Contract function and arguments
	 function, args := APIstub.GetFunctionAndParameters()
	 // Route to the appropriate handler function to interact with the ledger appropriately
	 if function == "queryMarksheet" {
		 return s.queryMarksheet(APIstub, args)
	 } else if function == "initLedger" {
		 return s.initLedger(APIstub)
	 } else if function == "createMarksheet" {
		 return s.createMarksheet(APIstub, args)
	 } else if function == "queryAllMarksheet" {
		 return s.queryAllMarksheet(APIstub)
	 } else if function == "queryMarksheetByEnrollmentNo" {
		 return s.queryMarksheetByEnrollmentNo(APIstub, args)
	 } else if function == "readMarksheet" {
		 return s.readMarksheet(APIstub, args)
	 }
 
	 return shim.Error("Invalid Smart Contract function name.")
 }
 func (t *SmartContract) queryMarksheetByEnrollmentNo(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	//   0
	// "bob"
	if len(args) < 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	enrolno := strings.ToLower(args[0])

	queryString := fmt.Sprintf("{\"selector\":{\"docType\":\"name\",\"enrolno\":\"%s\"}}", enrolno)

	queryResults, err := getQueryResultForQueryString(APIstub, queryString)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(queryResults)
}
func (t *SmartContract) readMarksheet(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	//   0
	// "queryString"
	if len(args) < 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	queryString := args[0]

	queryResults, err := getQueryResultForQueryString(APIstub, queryString)
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

 func (s *SmartContract) queryMarksheet(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
 
	 if len(args) != 1 {
		 return shim.Error("Incorrect number of arguments. Expecting 1")
	 }
 
	 marksheetAsBytes, _ := APIstub.GetState(args[0])
	 return shim.Success(marksheetAsBytes)
 }
 
 func (s *SmartContract) initLedger(APIstub shim.ChaincodeStubInterface) sc.Response {
	 marksheets := []Marksheet{
		 Marksheet{Name: "kp", EnrolNo: "1", Exam: "rag", Samester: "6", CGPA: "8.6"},
		 Marksheet{Name: "as", EnrolNo: "2", Exam: "rag", Samester: "6", CGPA: "8.6"},
		 Marksheet{Name: "js", EnrolNo: "3", Exam: "rag", Samester: "6", CGPA: "8.6"},
		 Marksheet{Name: "dm", EnrolNo: "4", Exam: "rag", Samester: "6", CGPA: "8.6"},		 
	 }
 
	 i := 0
	 for i < len(marksheets) {
		 fmt.Println("i is ", i)
		 marksheetAsBytes, _ := json.Marshal(marksheets[i])
		 APIstub.PutState("MARK"+strconv.Itoa(i), marksheetAsBytes)
		 fmt.Println("Added", marksheets[i])
		 i = i + 1
	 }
 
	 return shim.Success(nil)
 }
 
 func (s *SmartContract) createMarksheet(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
 
	 if len(args) != 6 {
		 return shim.Error("Incorrect number of arguments. Expecting 5")
	 }
 
	 var marksheet = Marksheet{Name: args[1], EnrolNo: args[2], Exam: args[3], Samester: args[4], CGPA: args[5]}
 
	 marksheetAsBytes, _ := json.Marshal(marksheet)
	 APIstub.PutState(args[0], marksheetAsBytes)
 
	 return shim.Success(nil)
 }
 
 func (s *SmartContract) queryAllMarksheet(APIstub shim.ChaincodeStubInterface) sc.Response {
 
	 startKey := "0"
	 endKey := "999"
 
	 resultsIterator, err := APIstub.GetStateByRange(startKey, endKey)
	 if err != nil {
		 return shim.Error(err.Error())
	 }
	 defer resultsIterator.Close()
 
	 // buffer is a JSON array containing QueryResults
	 var buffer bytes.Buffer
	 buffer.WriteString("[")
 
	 bArrayMemberAlreadyWritten := false
	 for resultsIterator.HasNext() {
		 queryResponse, err := resultsIterator.Next()
		 if err != nil {
			 return shim.Error(err.Error())
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
 
	 fmt.Printf("- queryAllMarksheet:\n%s\n", buffer.String())
 
	 return shim.Success(buffer.Bytes())
 }
 
 
 // The main function is only relevant in unit test mode. Only included here for completeness.
 func main() {
 
	 // Create a new Smart Contract
	 err := shim.Start(new(SmartContract))
	 if err != nil {
		 fmt.Printf("Error creating new Smart Contract: %s", err)
	 }
 }
