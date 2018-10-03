# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.http import HttpResponse, JsonResponse
from lib import connections as c
import psycopg2 as psql
from psycopg2 import sql
from timeit import default_timer as t
import urllib
import json
import re


def zoneQuery(query):
    parameters = query.split('&')
    for param in parameters:
        if 'zones' in param:
            mo = re.findall(r"(\d+)", param)
            eh = ''
            for m in mo:
                eh += '{}, '.format(m)
            zones = '({})'.format(eh[:-2])
        elif 'direction' in param:
            direction = param.split('=')[1].replace("%20",'')
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

def munQuery(query):
    parameters = query.split('&')
    for p in parameters:
        if 'muni' in p:
            mo = re.match(r'^muni=(\w+)%20(\w+)(%20)?(?(3)(\w+)|())', p)
            if not mo.group(3) is None:
                mcd = '{} {} {}'.format(mo.group(1), mo.group(2), mo.group(4))
            else:
                mcd = '{} {}'.format(mo.group(1), mo.group(2))
        elif 'direction' in p:
            direction = p.split('=')[1].replace("%20",'')
            if 'To' in direction:
                oppo = "FromZone"
            else:
                oppo = "ToZone"
    con = psql.connect("dbname={} user=postgres password={} host={} port=5432".format(c.DB_NAME, c.DB_PW, c.DB_HOST))
    cur = con.cursor()
    query = sql.SQL(c.mq.format(direction, oppo, mcd))
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


def queryCheck(request):
    check = request.get_full_path().split('?')[1]
    mo = re.match(r'^(\w+)=.*$', check)
    if mo.group(1) == 'zones':
        return zoneQuery(check)
    else:
        return munQuery(check)