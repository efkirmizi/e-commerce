FROM postgres:17

RUN apt-get update && apt-get install -y postgresql-server-dev-17 build-essential git && \
    git clone --branch v0.4.1 https://github.com/pgvector/pgvector.git /pgvector && \
    cd /pgvector && \
    make && make install && \
    cd / && rm -rf /pgvector && \
    apt-get purge -y postgresql-server-dev-17 build-essential git && \
    apt-get autoremove -y && apt-get clean
