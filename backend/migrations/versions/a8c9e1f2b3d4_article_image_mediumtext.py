"""store article data-url images as medium text

Revision ID: a8c9e1f2b3d4
Revises: f2a3b4c5d6e7
Create Date: 2026-09-24 12:30:00.000000

"""
from alembic import op
from sqlalchemy.dialects import mysql


# revision identifiers, used by Alembic.
revision = "a8c9e1f2b3d4"
down_revision = "f2a3b4c5d6e7"
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table("articles", schema=None) as batch_op:
        batch_op.alter_column(
            "image",
            existing_type=mysql.TEXT(),
            type_=mysql.MEDIUMTEXT(),
            existing_nullable=True,
        )


def downgrade():
    with op.batch_alter_table("articles", schema=None) as batch_op:
        batch_op.alter_column(
            "image",
            existing_type=mysql.MEDIUMTEXT(),
            type_=mysql.TEXT(),
            existing_nullable=True,
        )
