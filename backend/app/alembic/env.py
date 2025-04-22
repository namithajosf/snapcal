from __future__ import with_statement
import sys
import os
from alembic import context
from sqlalchemy import engine_from_config, create_engine
from sqlalchemy import pool
from app.database import Base
from app.database import DATABASE_URL

config = context.config

config.set_main_option("sqlalchemy.url", DATABASE_URL)

def run_migrations_online():
    # Use create_engine to connect to the database
    connectable = create_engine(config.get_main_option("sqlalchemy.url"))

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=Base.metadata,
            compare_type=True,
        )

        with context.begin_transaction():
            context.run_migrations()

run_migrations_online()
