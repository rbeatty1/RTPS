# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.http import HttpResponse, JsonResponse
from lib import connections as c
import psycopg2 as psql
from psycopg2 import sql
from timeit import default_timer as t
import json
import re

def zoneQuery(request):
    queryString = request.get_full_path().split('?')[1].split('&')
    for param in queryString:
        if 'zones' in param:
            mo = re.findall(r"(\d+)", param)
            eh = ''
            for m in mo:
                eh += '{}, '.format(m)
            zones = '({})'.format(eh[:-2])
            print(zones)
        elif 'direction' in param:
            direction = param.split('=')[1].replace("%20",'')
            print(direction)
            if 'To' in direction:
                oppo = "FromZone"
            else:
                oppo = "ToZone"
    con = psql.connect("dbname={} user=postgres password={} host={} port=5432".format(c.DB_NAME, c.DB_PW, c.DB_HOST))
    cur = con.cursor()
    query = sql.SQL(c.zq.format(direction, oppo, zones))
    cur.execute(query)
    rows = cur.fetchall()
    payload = []
    colnames = [desc[0] for desc in cur.description]
    for row in rows:
        cargo = {}
        cnt = 0  
        for col in colnames:
            cargo["{}".format(col)] = row[cnt]
            cnt += 1
        payload.append(cargo)
    if not len(payload) == 0:
        return JsonResponse(payload, safe=False)
    else:
        return HttpResponse("this")

def munQuery(request):
    print("municipality query")
    return HttpResponse('this')
