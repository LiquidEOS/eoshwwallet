const fetch = require('node-fetch');
var gpio = require('rpi-gpio');
var fs = require('fs');
var bdf = require('bdf');
const { padImageData, createBitmapFile } = require('./bitmap');
var BDF = new bdf();
var BDFBig = new bdf();
var gpiop = gpio.promise;
var http = require('http');
let Eos = require('eosjs');
let {ecc, Fcbuffer} = Eos.modules;

var bg1 = "Qk3eDwAAAAAAAD4AAAAoAAAAegAAAPoAAAABAAEAAAAAAAAAAAASCwAAEgsAAAIAAAACAAAA/////wAAAP8AAAAAAAAAAAAAAAAAAAAAAAAAAAAtoAAAAAAAAAAAAAAAAAAD//wAAAAAAAAAAAAAAAAAD///gAAAAAAAAAAAAAAAAD///+AAAAAAAAAAAAAAAAD////4AAAAAAAAAAAAAAAB/////AAAAAAAAAAAAAAAB/////4AAAAAAAAAAAAAAA//////AAAAAAAAAAAAAAAf/////4AAAAPAAAAAAAAAf//9///AAAAH4AAAAAAAAP//wD//4AAAD/AAAAAAAAD//AAD//AAAD/4AAAAAAAD//gAAf/wAAA//AAAAAAAA//gAAD/+AAAP/wAAAAAAAf/wAAAP/wAAB/8AAAAAAAP/4AAAB/8AAAP/AAAAAAAH/8AAAAP/gAAB/4AAAAAAB/8AAAAD/8AAAf+AAAAAAA//AAAAAf/AAAD/gAAAAAAP/gAAYAD/4AAA/4AAAAAAH/wAAHwA//AAAP+AAAAAAB/4AAB+AH/wAAD/gAAAAAA/+AAAfwA/+AAA/4AAAAAAP/AAAH+AH/wAAP+AAAAAAH/gAAB/gB/+AAH/gAAAAAB/4AAAf4AP/gAB/4AAAAAAf+AAAP+AD/+AA/8AAAAAAH/AAAD/gAf/wAf/AAAAAAD/wAAB/4AD//AP/wAAAAAA/8AAA/+AAf////4AAAAAAP+AAAP/AAH////+AAAAAAD/gAAH/wAA/////AAAAAAA/4AAD/4AAH////gAAAAAAP+AAB/+AAA////wAAAAAAD/gAA//AAAH///8AAAAAAB/8AAf/gAAAf//8AAAAAAAP+AAP/4AAAD//8AAAAAAAD/wAP/8AAAAP/+AAAAAAAAf+AP/+AAAAAv8AAAAAAAAP/6f//AAAAAAAAAAAAAAAB/////gAAAAAAAAAAAAAAAf////wAAAAAAAAAAAAAAAD////4AAAAAAAAAAAAAAAAf///8AAAAAAAAAAAAAAAAD///8AAAAAAAAAAAAAAAAA///+AAAAAAAAAAAAAAAAAD//+AAAAAAKAAAAAAAAAAAP/+AAAAAH//AAAAAAAAAAAv4AAAAAP///AAAAAAAAAAAAAAAAAf///8AAAAAAAAAAAAAAAAf////gAAAAAAAAAAAAAAAf////+AAAAAAAAAAAAAAAf/////wAAAAAAAAAAAAAAH/////+AAAAAAAAAAAAAAH//////wAAAAAAAAAAAAAD//////+AAAAAAAAAAAAAA///93//gAAAAAAAAAAAAA//+AAf/8AAAAAAAAAAAAAP/8AAA//AAAAAAAAAAAAAH/4AAAH/4AAAAAAAAAAAAB/8AAAAf+AAAAAAAAAAAAA/8AAAAH/gAAAAAAAAAAAAP+AAAAA/8AAAAAAAAAAAAD/AAAAAH/AAAAAAAAAAAAA/wAAAAB/wAAAAAAAAAAAAP8AAAAAP8AAAAAAAAAAAAD/AAAAAH/AAAAAAAAAAAAA/4AAAAA/wAAAAAAAAAAAAP/AAAAAP8AAAAAAAAAAAAD/9AAAAD/AAAAAAAAAAAAA//8AAAA/wAAAAAAAAAAAAH//gAAAP8AAAAAAAAAAAAA//wAAAH/AAAAAAAAAAAAAP/8AAAB/gAAAAAAAAAAAAB//AAAAf4AAAAAAAAAAAAAH/gAAAP+AAAAAAAAAAAAAA/4AAAH/AAAAAAAAAAAAAABQAAAB/wAAAAAAAAAAAAAAAAAAA/8AAAAAAAAAAAAAAAAAAA/+AAAAAAAAAAAAAAAAAAAf/gAAAAAAAAAAAAAAAAAE3/wAAAAAAAAAAAAAAAAA///4AAAAAAAAAAAAAAAAH///8AAAAAAAAAAAAAAAAD////AAAAAAAAAAAAAAAAH////4AAAAAAAAAAAAAAAH/////AAAAAAAAAAAAAAAD/////4AAAAAAAAAAAAAAD//////AAAAAAAAAAAAAAB//////4AAAAAAAAAAAAAA//////+AAAAAAAAAAAAAAf//0A//wAAAAAAAAAAAAAP//AAB/8AAAAAAAAAAAAAH//AAAP/AAAAAAAAAAAAAB/+AAAB/wAAAAAAAAAAAAA//AAAAP8AAAAAAAAAAAAAf/gAAAD/AAAAAAAAAAAAAH/gAAAA/wAAAAAAAAAAAAD/wAAAAP8AAAAAAAAAAAAA/8AAAAD/AAAAAAAAAAAAAf+AAAAB/gAAAAAAAAAAAAH/AAAAA/4AAAAAAAAAAAAB/wAAAAf8AAAAAAAAAAAAA/4AAAAP/AAAAAAAAAAAAAP+H/7u//gAAAAAAAAAAAAD/H/////wAAAAAAAAAAAAA/w/////8AAAAAAAAAAAAAP8f/////gAAAAAAAAAAAAD+D/////8AAAAAAAAAAAAA/w//////AAAAAAAAAAAAAP4P/////4AAAAAAAAAAAAD/B//////AAAAAAAAAAAAA/gP/////wAAAAAAAAAAAoH8AqqtP/8AAAAAAAAAAA/h/AAAAAP/AAAAAAAAAAAP4DAAAAAB/wAAAAAAAAAAB/gAAAAAAP8AAAAAAAAAAA/wAAAAAAD/AAAAAAAAAAAH+AAAAAAA/wAAAAAAAAAAD/gAAAAAAf4AAAAAAAAAAAf4AAAAAAH+AAAAAAAAAAAP+AAAAAAD/gAAAAAAAAAAB/gAAAAAD/wAAAAAAAAAAA/4AAAAAD/4AAAAAAAAAAAH+AAAAAH/+AAAAAAAHAAAB/gAAAA///AAAAAAAB/////////////gAAAAAAAf////////////4AAAAAAAP/////////////AAAAAAAB/////////////8AAAAAAAf/////////////AAAAAAAH/////////////4AAAAAAB/////////////+AAAAAAAP/////////////wAAAAAAB/////////////8AAAAAAAAhCRf4gQERCJf/AAAAAAAAAAAP8AAAAAAB/wAAAAAAAAAAD/gAAAAAAf8AAAAAAAAAAAf4AAAAAAD/AAAAAAAAAAAP+AAAAAAA/wAAAAAAAAAAB/AAAAAAAP8AAAAAAAAAAA/4AAAAAAH+AAAAAAAAAAAP+AAAAAAD/gAAAAAAAAAAB/gAAAAAB/4AAAAAAAAAAA/4AAAAABf8AAAAAAAAAAAH+AAAAAB/+AAAAAAACAAAB/gAAAAH//AAAAAAAB7VKq/6UyqqX//gAAAAAAAf////////////wAAAAAAAH/////////////AAAAAAAD/////////////4AAAAAAAf/////////////AAAAAAAH/////////////4AAAAAAB/////////////+AAAAAAAP/////////////wAAAAAAB/////////////8AAAAAAAP3d3/7bt7e3f//AAAAAAAAAAAH+AAAAAAD/wAAAAAAAAAAD/gAAAAAAf8AAAAAAAAAAA/4AAAAAAD/AAAAAAAAAAAP+AAAAAAA/wAAAAAAAAAAB/gAAAAAAP8AAAAAAAAAAAf4AAAAAAD/AAAAAAAAAAAP+AAAAAAB/gAAAAAAAAAAB/gAAAAAA/4AAAAAAAAAAAf4AAAAAA/+AAAAAAAAAAAH+AAAAAAv+AAAAAAAAAAAB/gAAAEQ//gAAAAAAAAAAAf4AAD////wAAAAAAAAAAAH+AAH////4AAAAAAAAAAAB/gAP////8AAAAAAAAAAAAf4AP////8AAAAAAAAAAAAH+AP/////AAAAAAAAAAAAD/gH/////4AAAAAAAAAAAAfwD//////AAAAAAAAAAAAP+D//////4AAAAAAAAAAAB/g///////AAAAAAAAAAAA/4f//9///4AAAAAAAAAAAH+P/+AH//+AAAAAAAAAAAD/H/8AB///wAAAAAAAAAAA/5/8AAfx/+AAAAAAAAAAAP4/8AAf8P/gAAAAAAAAAADQP+AAP+B/4AAAAAAAAAAAAD/AAH/gP/AAAAAAAAAAAAA/wAD/4B/wAAAAAAAAAAAAP8AD/8Af8AAAAAAAAAAAAD/gD/+AD/AAAAAAAAAAAAA/////AA/wAAAAAAAAAAAAP////wAP8AAAAAAAAAAAAD////4AD/AAAAAAAAAAAAAf///8AA/wAAAAAAAAAAAAH///8AAP8AAAAAAAAAAAABf//+AAD/AAAAAAAAAAAAAP///AAB/wAAAAAAAAAAAAA///AAAP4AAAAAAAAAAAAAH/+AAAH+AAAAAAAAAAAAAAPcAAAD/gAAAAAAAAAAAAAAAAAAA/4AAAAAAAAAAAAAAAAAAAf8AAAAAAAAAAAAAAAAAAAP/AAAAAAAAAAAAAAAAAAAH/wAAAAAAAAAAAAPgAAAAH/4AAAAAAAAAAAAP+AAAAD/8AAAAAAAAAAAAD/wAAAH/+AAAAAAAAAAAAB/+AAAP//gAAAAAAAAAAAAf/wAL///wAAAAAAAAAAAAH///////wAAAAAAAAAAAAD///////4AAAAAAAAAAAAAf//////8AAAAAAAAAAAAAH//////4AAAAAAAAAAAAAB//////8AAAAAAAAAAAAAAP/////wAAAAAAAAAAAAAAB////8AAAAAAAAAAAAAAAAP//8gAAAAAAAAAAAAAAAAB/8AAAAAAAAAAAAAAAAAAAH/AAAAAAAAAAAAAAAAAAAB/wAAAAAAAAAAAAAAAAAAAf8AAAAAAAAAAAAAAAAAAAH/AAAC6AAAAAAAAAAAAAAB/wAA//+AAAAAAAAAAAAAAP8AD///4AAAAAAAAAAAAAH/AP////AAAAAAAAAAAAAB/wf////4AAAAAAAAAAAAAf8f/////AAAAAAAAAAAAAH///////4AAAAAAAAAAAAB///////+AAAAAAAAAAAAAf///////wAAAAAAAAAAAAD/////f/8AAAAAAAAAAAAB////QAf/AAAAAAAAAAAAAP//6AAB/wAAAAAAAAAAAAB//wAAAP8AAAAAAAAAAAAAP/AAAAD/AAAAAAAAAAAAAA8AAAAA/wAAAAAAAAAAAAAAAAAAAP8AAAAAAAAAAAAAAAAAAAH/AAAAAAAAAAAAAAAAAAAB/gAAAAAAAAAAAAAAAAAAA/4AAAAAAAAAAAAAAAAAAAf8AAAAAAAAAAAAAAAAAAAf/AAAAAAAAAAAAAAAAAAA//gAAAAAAAAAAAAAAAAAB//wAAAAAAAAAAAAAAAAAH//4AAAAAAAAAAAAAAAAAD//8AAAAAAAAAAAAAAAAAB//8AAAAAAAAAAAAAAAAAAP/+AAAAAAAAAAAAAAAAAAD/+AAAAAAAAAAAAAAAAAAAf8AAAAAAAAAAAAAAAAAAAD4AAAAAAAAAAAAAAAAAAAAAAAAAAAA";
var bg2 = "Qk3eDwAAAAAAAD4AAAAoAAAAegAAAPoAAAABAAEAAAAAAAAAAAASCwAAEgsAAAIAAAACAAAA/////wAAAP/////////////////////A///////SX///////////wP/////+AAP//////////8D/////8AAAf//////////A/////8AAAB//////////wP////8AAAAH/////////8D////+AAAAA//////////A////+AAAAAH/////////wP///+AAAAAA/////////8D////gAAAAAH////4////A////wAACAAA////4H///wP///wAAX+AAH///4A///8D///4AAf/8AB///+AH///A///+AAf//gAP///AB///wP///AAf//8AB///wAP//8D///gAP///wAP//+AD///A///wAP///+AD///wA///wP//4AD////gAf//+AH//8D//+AB////8AD///gB///A///AB/////gA///8Af//wP//wAf//3/8AH///AH//8D//4AP//4P/AA///wB///A//+AH//+B/4AP//8Af//wP//AB///gP/AB///AH//8D//wA///4B/4AP//wB///A//4AP//+Af+AB//4Af//wP/+AH///gH/wAP/+AH//8D//gB///wB/8AB//AD///A//4A///8Af/gAP/gA///wP/8AP//+AH/8AA/gAf//8D//AD///AD//gABAAH///A//wB///wA//8AAAAB///wP/8Af//4AP//AAAAA///8D//AH//8AH//4AAAAf///A//wB//+AB///AAAAP///wP/8Af//AA///8AAAH///8D//AH//gAf///gAAD////A//wA//wAH///8AAB////wP/8AP/wAD////wAD////8D//AB/wAB/////gF/////A//4ACgAA////////////wP/+AAAAAf///////////8D//gAAAAP////////////A//8AAAAH////////////wP//gAAAD////////////8D//8AAAD/////////////A///gAAB/////////////wP//8AAB//////1//////8D///wAB/////4AA//////A////gH/////wAAB/////wP//////////gAAAH////8D//////////gAAAAP////A//////////gAAAAB////wP/////////wAAAAAP///8D/////////wAAAAAB////A/////////4AAAAAAP///wP////////8AAAAAAD///8D/////////AAABAAAf///A/////////AAB//gAD///wP////////wAD///AA///8D////////4AH///8AH///A////////+AD////AB///wP////////AD////8Af//8D////////wB/////AD///A////////8A/////4A///wP////////AP////+AP//8D////////wD/////wD///A////////8A/////8A///wP////////AH/////AP//8D////////wB/////wD///A////////8AC////8A///wP////////AAD////AP//8D////////4AA////wD///A////////+AAH///4A///wP////////wAD///+Af//8D////////+AA////gD///A/////////4Af///wB///wP/////////AH///4A///8D/////////+v///+AP///A///////////////AD///wP//////////////gB///8D//////////////gAf///A/////////////9QAP///wP///////////+AAAH///8D///////////8AAAD////A///////////0AAAA////wP//////////8AAAAH///8D//////////4AAAAA////A//////////8AAAAAH///wP/////////8AAAAAA///8D/////////+AAAAAAH///A//////////AAAAAAB///wP/////////gAAN/AAf//8D/////////wAA//+AD///A/////////4AA///wA///wP////////+AB///+AP//8D/////////AA////wD///A/////////gAf///8A///wP////////4Af////AP//8D////////8AP////wD///A/////////AD////8A///wP////////wB////+Af//8D////////4A/////AH///A////////+AP////gD///wP////////gH////wA///8D////////wBwAoRAAf///A////////8A8AAAAAP///wP////////AOAAAAAD///8D////////wDwAAAAAf///A////////8A8AAAAAD///wP///////+AfAAAAAAf//8D////////wDwAAAAAH///A////////8A+AAAAAB///wP////////AfwAAAAAP//8D//////+v4D/VWqyAD///A///////g+A/////wA///wP//////wD8/////+AP//8D//////+Af//////wD///A///////AP//////8A///wP//////4B///////AP//8D//////8Af//////gD///A///////gH//////4B///wP//////4B//////8Af//8D//////8Af/////8AP///A///////gH/////8AD///wP//////4B/////4AD///8D//4///+Af////AAA////A//+AAAAAAAAAAAAAf///wP//gAAAAAAAAAAAAH///8D//wAAAAAAAAAAAAA////A//+AAAAAAAAAAAAAD///wP//gAAAAAAAAAAAAA///8D//4AAAAAAAAAAAAAH///A//+AAAAAAAAAAAAAB///wP//wAAAAAAAAAAAAAP//8D//+AAAAAAAAAAAAAD///A////f3vAH//fu9ugA///wP//////4B//////+AP//8D//////8Af//////gD///A///////AH//////8A///wP//////4B///////AP//8D//////8Af//////wD///A///////gH//////4B///wP//////wB//////8Af//8D//////+Af//////AH///A///////AH/////+AD///wP//////4B/////+AB///8D//9///+Af////8AA////A//+FSragFra2tgAAf///wP//gAAAAAAAAAAAAP///8D//4AAAAAAAAAAAAA////A//8AAAAAAAAAAAAAH///wP//gAAAAAAAAAAAAA///8D//4AAAAAAAAAAAAAH///A//+AAAAAAAAAAAAAB///wP//wAAAAAAAAAAAAAP//8D//+AAAAAAAAAAAAAD///A///whEIACEkUkSRAA///wP//////4B//////8AP//8D//////8Af//////gD///A///////AH//////8A///wP//////wB///////AP//8D//////+Af//////wD///A///////gH//////8A///wP//////4B//////+Af//8D//////+Af//////AH///A///////gH//////AD///wP//////wB//////gA///8D//////+Af///7fAAf///A///////gH//8AAAAP///wP//////4B//4AAAAH///8D//////+Af/wAAAAD////A///////gH/wAAAAD////wP//////4B/4AAAAA////8D//////8Af4AAAAAH////A///////gH8AAAAAA////wP//////wB8AAAAAAH///8D//////+AfAAAAAAA////A///////AHgAACAAAH///wP//////4BwAB/8AAB///8D//////8A4AD/+AAAP///A///////AGAD//AOAD///wP//////wHgD//gD4Af//8D//////8fwB//4A+AH///A////////8A//4AfwA///wP////////AP/8AP+AP//8D////////wD/8AD/gD///A////////8Af8AA/8A///wP////////AAAAA//AP//8D////////wAAAAP/wD///A////////8AAAAP/8A///wP////////gAAAD//AP//8D////////4AAAB//wD///A/////////AAAB//8A///wP////////wAAA///AP//8D/////////AAA///gH///A/////////4AB///4A///wP/////////yO///+Af//8D///////////////AH///A///////////////gD///wP//////////////wA///8D//////////////4AP///A////////wf////4AH///wP///////wB////8AD///8D///////8AP///4AB////A///////+AB///wAAf///wP///////gAP/oAAAP///8D///////4AAAAAAAP////A///////8AAAAAAAH////wP///////gAAAAAAD////8D///////4AAAAAAH/////A///////+AAAAAAD/////wP///////wAAAAAP/////8D///////+AAAAD///////A////////oAADf///////wP////////AD/////////8D////////4A//////////A////////+AP/////////wP////////gD/////////8D////////4A///9V/////A////////+AP/+gAB////wP////////gD/6AAAH///8D////////8A/4AAAA////A////////+APgAAAAH///wP////////gDAAAAAA///8D////////4AAAAAAAH///A////////+AAAAAAAB///wP////////gAAAAAAAP//8D////////8AAAAAgAD///A/////////AAAAv/wA///wP////////wAAF//+AP//8D////////+AAP///wD///A/////////4A////8A///wP////////+D/////AP//8D///////////////wD///A///////////////4A///wP//////////////+Af//8D///////////////AH///A///////////////gD///wP//////////////gA///8D//////////////gAf///A/////////////8AAP///wP////////////4AAH///8D////////////8AAD////A////////////+AAD////wP////////////wAB////8D////////////8AB/////A/////////////gD/////wP////////////8H/////8D////////////////////A";
var bg3 = "Qk3eDwAAAAAAAD4AAAAoAAAAegAAAPoAAAABAAEAAAAAAAAAAAAlFgAAJRYAAAIAAAACAAAAAAAA///////////////////////////A//////4AAAAB////////wP///////////f///////8D///////////3////////A///////////9////////wP///////////f///////8D///////////3////////A///////////9////////wP///////////f///////8D///////////3////////A///////////9////////wP///////////f///////8D///////////3////////A///////////9////////wP///////////f///////8D///////////3////////A///////////9////////wP///////////f///////8D////////////////////A////////////////////wP///////////////////8D////////////////////A////////////////////wP///////////////////8D////////////////////A////////////////////wP/////+AAAAA////////8D////////////////////A////////////////////wP///////////////////8D////////////////////A////////////////////wP///////////////////8D////////////////////A////////////////////wP///////////////////8D////////4D//////////A////////z/n/////////wP///////z/+f////////8D///////7//7/////////A///////7///f////////wP//////9///7////////8D//////8////f////////A//////+/////////////wP//////f///+////////8D//////v/////////////A//////3////9////////wP/////7/////f///////8D/////9/////3////////A/////+//////////////wP/////f/////////////8D/////v//////////////A/////9//////////////wP/////v/////////////8D/////9/////3////////A//////v////9////////wP/////9/////f///////8D//////v/////////////A//////9////7////////wP//////v////f///////8D//////+////b////////A///////3///vf///////wP//////+f//37///////8D///////7//7/f///////A////////v/7/7///////wP///////+fz//f//////8D////////8H//7///////A////////////////////wP///////////////////8D////////////////////A////////////////////wP///////////////////8D////////////////////A////////////////////wP///////////////////8D//////gAAA//////////A//////////5/////////wP//////////n////////8D//////////+/////////A///////////3////////wP///////////////////8D///////////v////////A////////////////////wP///////////f///////8D///////////3////////A///////////9////////wP///////////////////8D////////////////////A///////////9////////wP///////////f///////8D///////////3////////A////////////////////wP//////////+////////8D////////////////////A///////////3////////wP//////////7////////8D//////////7/////////A//////////5/////////wP/////+AAAD/////////8D////////////////////A////////////////////wP///////////////////8D////////////////////A////////////////////wP///////////////////8D////////////////////A////////////////////wP///////////////////8D////////////////////A/////////////+//////wP/////+AAAAAf/gf////8D/////////////7f/////A/////////////+n/////wP/////////////z/////8D////////////////////A////////////////////wP///////////////////8D////////////////////A//////////////D/////wP/////////////uf////8D/////////////73/////A/////////////+5/////wP/////////////w/////8D//////AAAAAH/+f/////A//////3////9////////wP/////9/////f///////8D//////f////3////////A//////3////9/+f/////wP/////9/////f/g/////8D//////f////3//H/////A//////3////9/+H/////wP/////9/////f/j/////8D//////f////3/+H/////A//////3////9//h/////wP/////9/////f/j/////8D//////f////3////////A//////3////9////////wP///////////f///////8D//////v/////////////A//////7////7/+B/////wP/////+////+//of////8D//////3////v/63/////A//////9////3/+9/////wP//////v///7////////8D//////9///+/////////A///////v///f////////wP//////9///P////////8D///////n//P//4H/////A///////+P/P//+3/////wP///////8Af///o/////8D/////////////4n/////A////////////////////wP///////////////////8D////////////////////A////////////////////wP/////////////gf////8D/////////////4H/////A/////////////+t/////wP/////////////vf////8D////////////////////A////////////////////wP///////////////////8D////////////////////A/////////////+B/////wP/////////////uf////8D/////////////73/////A/////////////+Z/////wP/////4AAAAA//w/////8D/////+AAAAAP////////A//////j/8f/z////////wP/////5//v/8////////8D/////+f/7//P////////A//////n/+//z////////wP/////5//v/8////////8D/////+f/7//P////////A//////n/+//z////////wP/////5//v/8////////8D/////+f/7//P/4H/////A//////n/+//z/+t/////wP/////5//v/8//rf////8D/////+f/7//P/4P/////A//////n/+//z////////wP/////5//P/8////////8D/////+f/7//P////////A//////n////z////////wP/////5////8//v/////8D//////f////P/8//////A//////////////h/////wP/////////////j/////8D/////////////7//////A////////////////////wP///////////////////8D////////gf//////////A///////+AAf/////////wP//////+AAB/////////8D//////+D/4P/////////A///////D//w/////////wP//////j//+H////////8D//////x///x/////////A//////4///+P/+B/////wP/////+f///x//rf////8D//////H///+f/6H/////A//////z////n/+T/////wP/////8////8////////8D/////+f////P////////A//////n////z////////wP/////5////8////////8D/////+f////P//H/////A//////n////z//D/////wP/////5////8//n/////8D/////+f////P/8P/////A//////n////z//x/////wP/////8////8////////8D//////P///+f////////A//////x////n////////wP/////+f///x////////8D//////j///4//4H/////A//////8f//8f//P/////wP//////j//+H//5/////8D//////8P/+D///P/////A///////gf+D//+B/////wP//////+AAB/////////8D///////4AD//////////A////////4P//////////wP///////////////////8D/////////////8P/////A/////////////+Z/////wP/////////////vf////8D/////////////7n/////A//////////+f/+7/////wP//////4H//j////////8D//////4A//8f////////A//////8eH//n////////wP/////+P4//4//5/////8D//////H/P//P/4P/////A//////z/x//z/+5/////wP/////5/+f/8//vf////8D/////+f/j//P/7n/////A//////n/8//z//D/////wP/////5//P/8////////8D/////+f/x//P////////A//////n/+f/z////////wP/////5//n/4////////8D//////P/4/+f/4H/////A//////z//H/H/+D/////wP/////+f/w/j//t/////8D//////j/+AB//4H/////A//////9//wB///d/////wP/////////j/////////8D////////////////////A";
var tst = "Qk22AAAAAAAAAD4AAAAoAAAAGwAAAB4AAAABAAEAAAAAAHgAAAASCwAAEgsAAAAAAAAAAAAAAAAAAP///wD////g////4P///+D////g////4P/B/+D/HP/g/35/4P7/v+D+/5/g/n/f4P8/3+D/n9/g/8/f4P/j3+D/+9/g///f4PB/v+Dn/7/g7/+/4O//v+Dv/7/g7/9/4O/+f+D3/P/g+/n/4PgD/+D////g////4P///+A=";
const isDebug = process.env.DEBUG;
function sendImage(x,y,image){
	var host = 'localhost'
	if(!isDebug)
		return fetch('http://'+host+':8000', { method: 'POST', body: JSON.stringify({"x":x, "y":y,"data":image}) }).catch(a=>{
	 	
	 });
	else{
		 var req = http.request({
		  host:'[fe80::c71b:1b21:5588:351%43]',
		  hostname:'fe80::c71b:1b21:5588:351%43',
		  port:'8080',
		  method:'POST',
		  body: JSON.stringify({"x":x, "y":y,"data":image}),
		  path:'/',
		}, function(res){
		  console.log('Got response:', res.statusCode, res.headers);
		}).on('error', function(e){
		  console.log('error:', e);
		}).end();

	}


}
BDF.loadSync('c64.bdf');
BDFBig.loadSync('c64d.bdf');

let pixelMatrix = [];
let pixelMatrixPrev = [];
let displaySize = {height: 122, width: 250};
async function draw(){
	await sendPixelMatrix();
	setTimeout(draw,500);
}
function t(num){
	return num;
}
async function sendPixelMatrix(){
	// prepare data
	var innerDirtybounds = [displaySize.width,displaySize.height,0,0];
	for(var xi=0; xi < displaySize.width; xi++){
	            for(var yi=0; yi < displaySize.height; yi++){
			    if(pixelMatrix[xi][yi] != pixelMatrixPrev[xi][yi]){
				    var position = innerDirtybounds;
				    if(xi < position[0])
				              position[0] = xi;
				    if(xi > position[2])
				              position[2] = xi;
				    if(yi < position[1])
				              position[1] = yi;
				    if(yi > position[3])
				              position[3] = yi;

		            }
	            }
	}
	if(innerDirtybounds[0] > innerDirtybounds[2])
		return;
	innerDirtybounds = [0,0,displaySize.width-1,displaySize.height-1];
	//let width = innerDirtybounds[2] - innerDirtybounds[0] + 1;
	let height = innerDirtybounds[2] - innerDirtybounds[0] ;
	let width = innerDirtybounds[3] - innerDirtybounds[1] ;
	pixelMatrixPrev = JSON.parse(JSON.stringify(pixelMatrix));
	var data = [];
	var bits = 0;
	var currentNum = 0;
	var intData = [];
	//for(var yi=innerDirtybounds[1]; yi < innerDirtybounds[1] + width; yi++){
		for(var xi=innerDirtybounds[0]; xi < innerDirtybounds[0] + height-1; xi++){
	for(var yi=innerDirtybounds[1]; yi < innerDirtybounds[1] + width-1; yi++){
			 if(bits == 8){
				 bits = 0;
				 data.push(t(currentNum));
				 currentNum = 0;
			 }
			 currentNum = currentNum * 2;
			 if(pixelMatrix[xi][yi]){
				 currentNum = currentNum + 1;
			 }
			 bits++;
	            }
	}
	if(bits < 8){
		while(bits < 8){
			currentNum = currentNum * 2
			bits++
		}
		data.push(t(currentNum));
	}

const imageData = padImageData({
		  unpaddedImageData: Buffer.from(data),
		  width:width-1,
		  height:height-1
});
var image = (await createBitmapFile({
	  imageData,
	  width:width-1,
	  height:height-1,
	  bitsPerPixel: 1,
	  colorTable:Buffer.from([  0xFF, 0xFF, 0xFF, 0xFF,
	    0x00, 0x00, 0x00, 0x00])
	})).toString('base64');

//	var image = tst;
	// send data
//	console.log(innerDirtybounds,image);
	await sendImage(innerDirtybounds[1],innerDirtybounds[0],image);
}
async function init(){
	for(var xi=0; xi < displaySize.width; xi++){
		var col = [];
		var col2 = [];
		pixelMatrix.push(col);
		pixelMatrixPrev.push(col2);
		for(var yi=0; yi < displaySize.height; yi++){
			col.push(true);
			col2.push(false);
		}
	}
	// sendPixelMatrix(0,0,displaySize.width,displaySize.height);
//	clear(false);
	draw();

	await splash();
}


function drawPixel(x,y,c){
	var col = pixelMatrix[x];
	if(col && col.length > y)
		col[y] = c;
}

function clear(color){
	drawBox(0,0,displaySize.width,displaySize.height,color,color);
}
function drawBox(x,y,w,h,b,f){
	for(var xi=x; xi < x+w; xi++){
		for(var yi=y; yi < y+h; yi++){
			var color = f || (b && (xi == x || xi == x+w-1 || yi == y || yi == y+h-1));
			drawPixel(xi,yi,color);
		}
	}
}

function drawText(xo,yo, t,color, big){
	var b = big ? BDFBig : BDF;
	var bitmap = b.writeText(t,{});
	//console.log(bitmap);
	var keys=Object.keys(bitmap);
	for(var y=0; y< keys.length; y++){
	  for(var x=0; x< bitmap[keys[y]].length; x++){
		  if(bitmap[keys[y]][x] == 1)
			  drawPixel(x+xo,y+yo,color);
	  }
	}
}
function drawLine(x0,y0,x1,y1,c){
	      var dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
	      var dy = Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1; 
	      var err = (dx>dy ? dx : -dy)/2;        
	      while (true) {
		              drawPixel(x0,y0,c);
		              if (x0 === x1 && y0 === y1) break;
		              var e2 = err;
		              if (e2 > -dx) { err -= dy; x0 += sx; }
		              if (e2 < dy) { err += dx; y0 += sy; }
		}
}

async function splash(){
	await sendImage(0,0,bg3);
	await delay(2000);
	await sendImage(0,0,bg1);
	clear(true);
	await delay(2000);
}
class RebootTimer {
	constructor(){		
		var minutes = 15;
		this.gracePeriod = 1000 * 60 * minutes;
		this.resetTimer();
		this.run();
	}
	resetTimer(){
		this.lastUse = new Date().getTime();
	}
	run(){
		var this2 = this;
		if(isDebug)
			return;
		if(this.lastUse + this.gracePeriod < new Date().getTime()){
			this.reboot();
		}
		else
			setTimeout(()=>{
				this2.run();
			},10000);
	}
	async reboot(){
		clear(false);
		drawText(3,3,"rebooting...", true);
		await delay(5000);
		clear(true);
		drawText(3,3,"rebooting...", false);
		await delay(3000);
		require('child_process').exec('sudo /sbin/shutdown -r now', function (msg) { console.log(msg) });
	}

}

var lastTimes = {};
var wasBothClick = false;

class InputMessage {
	constructor(options){
		
		this.options = options;

		
	}
	start(){
		var this2 = this;
		this.input = "";		
		this.showLast = false;
		this.selection = 0;
		currentUI = this;
		setTimeout(()=>{
			this2.drawOptions();
		},100);

	}
	L(){
		var newSelection = this.selection -1;
		if(newSelection < 0)
			newSelection = this.options.choices.length-1;
		this.updateSelection(newSelection);
	}
	R(){
		var newSelection = this.selection +1;
		if(newSelection >= this.options.choices.length)
			newSelection = 0;
		this.updateSelection(newSelection);

	}
	selectInput(){
		this.options.onSelect(this.input);
		this.input = "";
		this.showLast = false;
		this.selection = 0;
	}
	B(){
		this.showLast = false;
		if(this.options.choices[this.selection] == '!'){		
			this.selectInput(this.input);
			this.input = "";
			return;
		}
		else if(this.options.choices[this.selection] == '<'){
			this.input = this.input.substr(0, this.input.length-1);
		}
		else{
			this.input = this.input + this.options.choices[this.selection].toString();
			this.showLast = true;
		}		
		this.drawOptions();
	}
	updateSelection(newSelection){
		this.selection = newSelection;		
		this.drawOptions();
	}

	drawOptions(){				
		const {title,choices,hide} = this.options;
		clear(false);
		drawText(3,3,title, true);
		for(var i=0; i < choices.length ; i++){
			drawBox(3+ i * 13,15, 15 ,20,true, i === this.selection);
			drawText(3+i*13+1,25,choices[i].toString(), i !== this.selection);
		}

        var textToDraw = '';
		if(this.input.length > 0){
			if(hide){
				if(this.showLast)
					textToDraw = '*'.repeat(this.input.length-1) + this.input[this.input.length-1];
				else 
					textToDraw = '*'.repeat(this.input.length);
			}
			else{
				textToDraw =  this.input;
			}
		}
		drawText(50,70,textToDraw,true);
	}
}

class ConfirmationMessage {
	constructor(options){
		
		options.choices = ['Y','N'];
		this.options = options;


		
	}
	start(){
		var this2 = this;
		this.selection = 0;
		currentUI = this;
		setTimeout(()=>{
			this2.drawOptions();
		},100);
	}
	L(){
		var newSelection = this.selection -1;
		if(newSelection < 0)
			newSelection = this.options.choices.length-1;
		this.updateSelection(newSelection);
	}
	R(){
		var newSelection = this.selection +1;
		if(newSelection >= this.options.choices.length)
			newSelection = 0;
		this.updateSelection(newSelection);

	}
	selectInput(){
		this.options.onSelect(this.options.choices[this.selection]);
	}
	B(){
		this.drawOptions();
		this.selectInput();		
	}
	updateSelection(newSelection){
		this.selection = newSelection;		
		this.drawOptions();
	}

	drawOptions(){				
		const {title,choices,text, text2} = this.options;
		clear(false);
		drawText(3,3,title, true);
		for(var i=0; i < choices.length ; i++){
			drawBox(3+ i * 13,15, 15 ,20,true, i === this.selection);
			drawText(3+i*13+1,25,choices[i].toString(), i !== this.selection);
		}        
		drawText(20,65,text,true);
		drawText(20,80,text2,true);
	}
}

function buttonL(){
	if(lastTimes.l){
		if(lastTimes.l + 250 > new Date().getTime())
			return;
	}
	if(currentUI) currentUI.L();
	
	// sendImage(0,0,bg2);
	lastTimes.l = new Date().getTime();
}
function buttonR(){	
	if(lastTimes.r){

		if(lastTimes.r + 250 > new Date().getTime())
			return;
	}
	if(currentUI) currentUI.R();
	lastTimes.r = new Date().getTime();
}

function buttonBoth(){
	if(lastTimes.b){
		if(lastTimes.b + 250 > new Date().getTime())
			return;
	}
	wasBothClick = true;
	lastTimes.b = new Date().getTime();
	if(currentUI)
		currentUI.B();
}
var state = {};


gpio.on('change', function(channel, value) {
	if(rebootTimer)
		rebootTimer.resetTimer();
	if(state[channel] == value)
		return;
	state[channel] = value;
	//console.log(channel,value)
	if(value){
		//console.log(state);
		if(channel == 26){
			if(state['19']){
				buttonBoth();
			}
			//else
			//	buttonL();
		}
		else if (channel == 19){
			if(state['26']){
				buttonBoth();
			}
			//else
			//	buttonR();
		}
	}
	else{
		if(state['26'] || state['19'])
			return;
		if(wasBothClick){
			wasBothClick = false;
		}
		else{
			if(channel == 26){
				buttonL();
			}
			else{
				buttonR();
			}
			
		}

	}
});
if(!isDebug){
	gpio.setMode(gpio.MODE_BCM);
	gpio.setup(19, gpio.DIR_IN, gpio.EDGE_BOTH);
	gpio.setup(26, gpio.DIR_IN, gpio.EDGE_BOTH);
	

}
else{
	var keypress = require('keypress');

	// make `process.stdin` begin emitting "keypress" events
	keypress(process.stdin);
	 
	// listen for the "keypress" event
	process.stdin.on('keypress', function (ch, key) {	  
	  if (key) {
	  	if (key.ctrl && key.name == 'c') {
		    process.exit(1);
		}
	  	else if(key.name == 'space')
	    	buttonBoth();
	    else if(key.name == 'x')
	    	buttonR();
	    else if(key.name == 'z')
	    	buttonL();
	  }
	});
	 
	process.stdin.setRawMode(true);
	process.stdin.resume();
}



var currentUI;



const express = require('express');
var bodyParser = require('body-parser')


var unlocked = false;
const app = express()
app.use(bodyParser.json());
app.get('/', async (req, res) => {
	if(!unlocked){
		clear(false);
		drawText(0,0,"click to unlock", true);
		res.send('locked');
		return;
	}
	res.send(publicKey);
});
app.post('/', async (req, res) => {
	console.log(req.body);
	if(!unlocked){
		clear(false);
		drawText(0,0,"click to unlock", true);
		res.send('locked');
		return;
	}
	const confirm = new ConfirmationMessage({
		title: "sign?",
		text: req.body.text || "",
		text2: req.body.text2 || "",
		onSelect: async (yn)=>{
				if(yn == 'Y'){					
					var signature = ecc.sign(Buffer.from(req.body.data, 'base64'), privateKey);

					clear(false);
					drawText(0,0,"signed", true);
					res.send("signed transaction: " + signature);
					currentUI = null;
				}
				else {
					
					clear(false);
					drawText(0,0,"rejected", true);
					res.send("rejected transaction.");
					
					currentUI = null;
				}

			}
	});
	confirm.start();
})
// return public keys

// sign transaction

app.listen(3000, () => console.log('Wallet listening on port 3000!'))

const hdkey = require('hdkey')
const wif = require('wif')
const bip39 = require('bip39')

async function genSeed(pw){	
    let mnemonic = bip39.generateMnemonic();
    mnemonic = await genMnemonicWithPass(pw);
    // mnemonic = bip39.generateMnemonic();
	const words = mnemonic.split(' ');	
	return words;
}
async function showSeed(words){
		for (var i = 0; i <= words.length - 1; i++) {
			var word = words[i];
			clear(false);
			drawText(3,3,(i+1) + ". " + word, true);
			await delay(4000);
		}

}
async function genShowSeed(pw){
		clear(false);
		drawText(3,3,"generating seed", true);
		await delay(4000);
		// showing seed.			
		clear(false);
		drawText(3,3,"showing seed:", true);
		console.log('showing seed');
		await delay(4000);		
		const words = await genSeed();
		await showSeed(words);
		clear(false);
		console.log('showing seed again');
		drawText(3,3,"showing seed again:", true);
		await delay(4000);
		await showSeed(words);

		console.log("proceed?")
		// do you want to proceed?
		const confirm = new ConfirmationMessage({
			title: "proceed?",
			text: "did you write it down?",
			onSelect: async (yn)=>{
				if(yn == 'Y'){
					// proceed
					clear(false);
					// verify password
					drawText(3,3,"verifying", true);
					await delay(4000);

					// await delay(4000);
					// clear(false);
					// unlocked
					currentUI = null;
					unlockWallet(genMnemonicWithPass(pw));

				}
				else {
					// restart process
					clear(false);
					drawText(3,3,"generating new seed", true);
					await delay(4000);
					genShowSeed(pw);
				}

			}
		});		
		confirm.start();
}

var publicKey = '';
var privateKey = '';
async function genMnemonicWithPass(password){
	const hash = await secureHash(password);
    let mnemonic = bip39.entropyToMnemonic(hash);
    return bip39.mnemonicToSeedHex(mnemonic);
}
function chunkSubstr(str, size) {
  const numChunks = Math.ceil(str.length / size)
  const chunks = new Array(numChunks)

  for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
    chunks[i] = str.substr(o, size)
  }

  return chunks
}

function unlockWallet(mnemonic){
	unlocked = true;
	rebootTimer = new RebootTimer();
	const seed = bip39.mnemonicToSeedHex(mnemonic)
	const master = hdkey.fromMasterSeed(Buffer(seed, 'hex'))
	const node = master.derive("m/44'/194'/0'/0/0")
	publicKey = ecc.PublicKey(node._publicKey).toString();
	privateKey = wif.encode(128, node._privateKey, false);
	clear(true);
	drawText(3,3,"unlocked", false);
	var chunks = chunkSubstr(publicKey, 25);
	for (var i = 0; i <= chunks.length - 1; i++) {		
		drawText(3,30 + i * 25,chunks[i], false);
	}
}

async function secureHash(cleartext) {
	const scrypt = require('scrypt-async');
    return new Promise(async resolve => {
        const salt = "6923hello$";
        scrypt(cleartext, salt, {
            N: 16384,
            r: 8,
            p: 1,
            dkLen: 16,
            encoding: 'hex'
        }, (derivedKey) => {
            resolve(derivedKey);
        })
    });
}

function startSelectPW(){
	var selectPw = new InputMessage({
		title: "choose password",
		onSelect: async (pw)=>{
			selectPw = new InputMessage({
				title: "verify password",
				onSelect: async (pw2)=>{
					if(pw != pw2){
						clear(false);
						drawText(3,3,"passwords do not match", true);
						await delay(4000);
						startSelectPW();
					}
					else{
						fs.writeFileSync('/home/pi/wallet.inited', "");
						genShowSeed(pw);
					}					
				},
				hide: true,
				choices: [1,2,3,4,5,6,7,8,9,0,'A','B','C','D','E','F','<','!']
			});
			selectPw.start();
		},
		hide: true,
		choices: [1,2,3,4,5,6,7,8,9,0,'A','B','C','D','E','F','<','!']
	});
	selectPw.start();
}


const delay = time => new Promise(res=>setTimeout(()=>res(),time));
var rebootTimer;
var enterPw = new InputMessage({
	title: "enter password",
	hide: true,
	onSelect: async (pw)=>{
		clear(false);
		// verify password
		drawText(3,3,"verifying", true);
		await delay(4000);

		// await delay(4000);
		// clear(false);
		// unlocked
		var mnemonic = '';
		mnemonic = await genMnemonicWithPass(pw);
		unlockWallet();
		currentUI = null;
		
	},
	choices: [1,2,3,4,5,6,7,8,9,0,'A','B','C','D','E','F','<','!']
});


var passwordExist = fs.existsSync('/home/pi/wallet.inited');
init().then(()=>{
	clear(true);
	if(passwordExist){
		enterPw.start();
	}
	else{
		startSelectPW();
	}
});

