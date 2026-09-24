"""Clean all tables from the database.

Safely drops all tables (including alembic_version) with foreign key checks
disabled so `flask db upgrade` can run cleanly from scratch.
"""
import click
from flask.cli import with_appcontext
from sqlalchemy import text
from models import db


def perform_db_clean():
    engine = db.engine
    dialect_name = engine.dialect.name
    print(f"Connecting to database ({dialect_name}): {engine.url.render_as_string(hide_password=True)}")

    with engine.connect() as conn:
        if dialect_name == "mysql":
            conn.execute(text("SET FOREIGN_KEY_CHECKS = 0;"))
            result = conn.execute(text("SHOW TABLES;"))
            tables = [row[0] for row in result.fetchall()]
        elif dialect_name == "sqlite":
            conn.execute(text("PRAGMA foreign_keys = OFF;"))
            result = conn.execute(
                text("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';")
            )
            tables = [row[0] for row in result.fetchall()]
        else:
            tables = list(db.metadata.tables.keys())

        if not tables:
            print("No tables found. Database is already clean.")
        else:
            for table in tables:
                print(f"Dropping table: {table}")
                if dialect_name == "mysql":
                    conn.execute(text(f"DROP TABLE IF EXISTS `{table}`;"))
                else:
                    conn.execute(text(f'DROP TABLE IF EXISTS "{table}";'))
            print(f"Dropped {len(tables)} table(s).")

        if dialect_name == "mysql":
            conn.execute(text("SET FOREIGN_KEY_CHECKS = 1;"))
        elif dialect_name == "sqlite":
            conn.execute(text("PRAGMA foreign_keys = ON;"))

        conn.commit()

    print("Database is completely clean! You can now run 'flask db upgrade'.")


@click.command("clean-db")
@with_appcontext
def clean_db_command():
    """Drop all tables from the database so migrations can run from scratch."""
    perform_db_clean()


def clean_database():
    from app import create_app
    app = create_app()
    with app.app_context():
        perform_db_clean()


if __name__ == "__main__":
    clean_database()
