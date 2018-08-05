##
 #  @filename   :   main.cpp
 #  @brief      :   2.13inch e-paper display demo
 #  @author     :   Yehui from Waveshare
 #
 #  Copyright (C) Waveshare     September 9 2017
 #
 # Permission is hereby granted, free of charge, to any person obtaining a copy
 # of this software and associated documnetation files (the "Software"), to deal
 # in the Software without restriction, including without limitation the rights
 # to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 # copies of the Software, and to permit persons to  whom the Software is
 # furished to do so, subject to the following conditions:
 #
 # The above copyright notice and this permission notice shall be included in
 # all copies or substantial portions of the Software.
 #
 # THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 # IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 # FITNESS OR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 # AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 # LIABILITY WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 # OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 # THE SOFTWARE.
 ##

import epd2in13
import time
import Image
import ImageDraw
import ImageFont

epd = epd2in13.EPD()
epd.init(epd.lut_full_update)
image = Image.new('1', (epd2in13.EPD_WIDTH, epd2in13.EPD_HEIGHT), 0)  # 255: clear the frame
epd.clear_frame_memory(0xFF)
epd.set_frame_memory(image, 0, 0)
epd.display_frame()
image = Image.new('1', (epd2in13.EPD_WIDTH, epd2in13.EPD_HEIGHT), 255)
epd.init(epd.lut_partial_update)
#image = Image.open('monocolor.bmp')
##
 # there are 2 memory areas embedded in the e-paper display
 # and once the display is refreshed, the memory area will be auto-toggled,
 # i.e. the next action of SetFrameMemory will set the other memory area
 # therefore you have to set the frame memory twice.
 ##     
epd.set_frame_memory(image, 0, 0)
epd.display_frame()

import sys
import BaseHTTPServer
from SimpleHTTPServer import SimpleHTTPRequestHandler
import SimpleHTTPServer

import logging
import cgi
import base64
import simplejson
import StringIO

def wx2PIL (buffer):
    file_jpgdata = StringIO.StringIO(buffer)
    return Image.open(file_jpgdata)

class PostHandler(SimpleHTTPServer.SimpleHTTPRequestHandler):
    def do_POST(self):
        data_string = self.rfile.read(int(self.headers['Content-Length']))
        postvars = simplejson.loads(data_string)
	data = postvars['data'].decode('base64')
        offsetX = int(postvars['x'])
        offsetY = int(postvars['y'])
        to_draw = wx2PIL(data)
        width = to_draw.width
        height = to_draw.height
        the_image = Image.frombuffer('1', (width, height), data, 'raw', '1',0,1)
        draw = ImageDraw.Draw(the_image)
        draw.rectangle((0, 0, width, height), fill = 0)
        the_image.paste(to_draw.transpose(Image.ROTATE_180), (0, 0, width,height))
        epd.set_frame_memory(the_image, offsetX, offsetY)
        epd.display_frame()
        epd.set_frame_memory(the_image, offsetX, offsetY)
        epd.display_frame()
        self.send_response(200, "")

HandlerClass = PostHandler
ServerClass  = BaseHTTPServer.HTTPServer
Protocol     = "HTTP/1.0"

if sys.argv[1:]:
    port = int(sys.argv[1])
else:
    port = 8000
server_address = ('0.0.0.0', port)

HandlerClass.protocol_version = Protocol
httpd = ServerClass(server_address, HandlerClass)

sa = httpd.socket.getsockname()
print "Serving HTTP on", sa[0], "port", sa[1], "..."
httpd.serve_forever()
