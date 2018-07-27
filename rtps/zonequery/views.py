# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.http import HttpResponse
from lib import connections as c
import psycopg2 as psql

# Create your views here.
def index(response):
    con = psql.connect("dbname={} user=postgres password={} host={} port=5432".format(c.DB_NAME, c.DB_PW, c.DB_HOST))
    cur = con.cursor()
    cur.execute(c.qry.format(10225))
    rows = cur.fetchall()
    payload = []
    for r in rows:
        print(r[1])
    return HttpResponse("This is the index page!")