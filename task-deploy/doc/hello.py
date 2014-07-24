#!/usr/bin/env  python
# -*- coding: utf-8 -*-

import cgi
import cgitb
import random
cgitb.enable()

import urllib2
import time


print "Content-Type: text/html"     # HTML is following
print


#cgi.test()
form = cgi.FieldStorage()
id=form["id"].value
receipt="http://172.20.225.236:8087/task/job/log/receipt?id=%s&result=%d&desc=" % (id,random.choice((0,1)) )

time.sleep(random.randint(1,30))

f=urllib2.urlopen(receipt)
print "data:"
print f.geturl()

print "info:"
print f.info()

