FROM tiangolo/uwsgi-nginx-flask:python2.7
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt
COPY ./app /app
