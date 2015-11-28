# -*- coding: utf-8 -*-
from datetime import datetime
import pymongo

client = pymongo.MongoClient('mongodb://94.103.80.182:27000/')
db = client.movies.movies
db2 = client.movies2.movies2


# print(db.movies.find().count())
# title: {
#     russian: { type: String, default: '' },
#     original: { type: String, default: '' }
# },
# genre: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Genre' }],
# country: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Country' }],
# directed: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Directed' }],
# duration: [Number],
# year: [Number],
# date: [Date],
# desc: [String],
# search: [String]
def base2():
    for n in db2.find():
        _id = n['_id']

        m = {}
        m['title'] = {}
        m['title']['russian'] = n['title_ru']
        m['title']['original'] = n['title']
        m['genre'] = n['genres']
        m['country'] = n['countrys']
        m['directed'] = n['genres']
        m['duration'] = n['duration']
        m['year'] = n['year']
        if n['date'] != '':
            m['date'] = datetime.strptime(n['date'], '%d.%m.%Y')
        else:
            m['date'] = ''
        m['search'] = ''
        m['desc'] = ''
        m['kinomania_id'] = n['id']

        db.movies.update({u'_id': _id}, m)


base2()
