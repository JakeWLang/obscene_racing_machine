#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Mon Feb 14 12:07:59 2022

@author: jakelang
"""

import pandas as pd
import urllib
import json



url = r"https://static01.nyt.com/newsgraphics/2022/01/29/brady-career/216fe5204c6d41cf312f933f886cc16d35e148e9/player-lookup.json"
response = urllib.request.urlopen(url)
data = json.loads(response.read())

json_names = pd.DataFrame(data.values())
stats_tsv = pd.read_csv('/Users/jakelang/Documents/Harris - MPP - 2021-2022/Winter 2022/Data Viz 22/Assignment 3/line-chart/cumulative-stats.tsv',
                        sep = '\t')

json_names = json_names[['player_id', 'player_name']]

name_merge = stats_tsv.merge(json_names)

name_merge.to_csv('/Users/jakelang/Documents/Harris - MPP - 2021-2022/Winter 2022/Data Viz 22/Assignment 3/line-chart/stats.csv')
