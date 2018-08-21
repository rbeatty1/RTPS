# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.http import HttpResponse, JsonResponse
from lib import connections as c
import psycopg2 as psql
from psycopg2 import sql
from timeit import default_timer as t
import json

# Create your views here.
def qry1(request):
    start = t()
    this = request.get_full_path().split('zones=[')[1].split(',')
    para = '('
    for i in this:
        if ']' in i:
            para += '{})'.format(i[:-1])
        else:
            para += '{}, '.format(i)
    con = psql.connect("dbname={} user=postgres password={} host={} port=5432".format(c.DB_NAME, c.DB_PW, c.DB_HOST))
    cur = con.cursor()
    cur.execute(c.qry.format(para))
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
    end = t()
    time = round((end - start), 2)
    if len(payload) == 0:
        return HttpResponse("Query returned no results")
    else:
        return JsonResponse(payload, safe=False)