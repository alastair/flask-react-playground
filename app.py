import json
import math
from typing import List

import pydantic as pydantic
from flask import Flask, request, render_template, jsonify


app = Flask(__name__)


def makeRegistry():
    registry = {}

    def registrar(func):
        registry[func.__name__] = func
        return func  # normally a decorator returns a wrapped function,
                     # but here we return func unmodified, after registering it
    registrar.all = registry
    return registrar


exported_model = makeRegistry()


class DataRow(pydantic.BaseModel):
    id: int
    name: str


@exported_model
class DataResponse(pydantic.BaseModel):
    data: List[DataRow]


# This is some dummy data, returned by the db module
database = [
    DataRow(id=1, name="one"),
    DataRow(id=2, name="two"),
    DataRow(id=3, name="three"),
    DataRow(id=4, name="four"),
    DataRow(id=5, name="five"),
    DataRow(id=6, name="six"),
    DataRow(id=7, name="seven"),
    DataRow(id=8, name="eight"),
    DataRow(id=9, name="nine"),
    DataRow(id=10, name="ten"),
    DataRow(id=11, name="eleven"),
    DataRow(id=12, name="twelve"),
    DataRow(id=13, name="thirteen"),
    DataRow(id=14, name="fourteen"),
    DataRow(id=15, name="fifteen")
]


def load_data(page):
    """Load a page of data from the database. This is a "db" method"""
    assert page > 0
    items_per_page = 4
    # we number pages from 1, so remove 1 from it to start from beginning of the list
    data = database[(page-1)*items_per_page:page*items_per_page]
    return DataResponse(data=data)


def get_total_pages():
    """Get the number of pages can be shown. This is a "db" method"""
    items_per_page = 4
    return math.ceil(len(database)/items_per_page)


def get_page_arg():
    """read the ?page argument, and return it as an integer.
    Return 1 if no page argument is set, or if it's not a valid
    integer"""
    page = request.args.get('page', '1')
    try:
        page = int(page)
    except ValueError:
        page = 1
    return page


@app.route('/')
def main():
    """Load the main page in html"""
    page = get_page_arg()

    items = load_data(page)
    total_pages = get_total_pages()
    context = {"current_page": page,
               "total_pages": total_pages,
               "items": items}

    return render_template('index.html', **context)


@app.route('/react')
def react():
    """Load the main page in react"""

    page = get_page_arg()

    items = load_data(page)
    total_pages = get_total_pages()
    data = {"current_page": page,
            "total_pages": total_pages,
            "items": items.dict()}
    context = {"props": json.dumps(data)}

    return render_template('react.html', **context)


@app.route('/api/data')
def api_data():
    page = get_page_arg()
    return jsonify(load_data(page).dict())


@app.route('/api/data.schema')
def api_data_schema():
    return jsonify(DataResponse.schema())


if __name__ == '__main__':
    app.run()
