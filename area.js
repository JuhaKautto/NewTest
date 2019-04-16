const fs = require('fs');
const Vector3 = require('vector-3');

const model = process.argv[2]; //read the command line argument
var objVText;
var objFText;
var objVArray = new Array();
var objFArray = new Array();
var vectorsArray = new Array();
var numbersArray = new Array();
var totalArea = 0;

fs.readFile(model, "utf8", (err, data) => {
	if (err) throw err;
	//split the .obj data into two tidied up arrays - other containing the vertex data (v)...
	//...and the other the numbered order of vertices (f)
	objVText = data;
	objVText = objVText.replace(/\r|\n|  /g,'');
	objVText = objVText.substring(0, objVText.indexOf('#'));
	objFText = data;
	objFText = objFText.replace(/ \r| \n| \r\n|\r|\n/g,'');
	objFText = objFText.split('g Torus_Knot01')[1]; //specific to this model (room for improvement)
	
	objVArray = objVText.split("v");
	objVArray.shift();
	objFArray = objFText.split("f ");
	objFArray.shift();
	//loop through the "v" values array and make an array of vectors
	for (i = 0; i < objVArray.length; i++)
	{
		var tempArray = objVArray[i].split(" ");
		for (j = 0; j < tempArray.length; j++) {
			tempArray[j] = parseFloat(tempArray[j], 10);
		}
		var tempVector = new Vector3(tempArray[0], tempArray[1], tempArray[2]);
		vectorsArray.push(tempVector);
	}
	//loop through the "f" values array and make a nested array of the vertex order numbers
	for (i = 0; i < objFArray.length; i++)
	{
		var tempNumArray = objFArray[i].split(" ");
		for (j = 0; j < tempNumArray.length; j++) {
			tempNumArray[j] = parseInt(tempNumArray[j], 10);
		}
		numbersArray.push(tempNumArray);
	}
	//loop through the order numbers and find the corresponding vectors...
	//...then calculate the area of this polygon and add to the total area
	for (i = 0; i < numbersArray.length; i++)
	{
		var vectorA = new Vector3(vectorsArray[numbersArray[i][0]]);
		var vectorB = new Vector3(vectorsArray[numbersArray[i][1]]);
		var vectorC = new Vector3(vectorsArray[numbersArray[i][2]]);
		var subVector1 = vectorB.substract(vectorA); // area of triangle defined by vectors: |(b-a)X(c-a)|/2
		var subVector2 = vectorC.substract(vectorA);
		var polyArea = subVector1.cross(subVector2);
		polyArea = polyArea.length();
		polyArea = polyArea/2;
		totalArea = totalArea + polyArea;
	}
	console.log(totalArea);
});