"""store delivery addresses and Geoapify references for business locations

Revision ID: 9ab4c7d2e130
Revises: d1ba4e69c302
Create Date: 2026-09-20 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


revision = "9ab4c7d2e130"
down_revision = "d1ba4e69c302"
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table("business_locations") as batch_op:
        batch_op.add_column(sa.Column("address", sa.String(length=255), nullable=True))
        batch_op.add_column(sa.Column("place_id", sa.String(length=255), nullable=True))
        batch_op.add_column(sa.Column("latitude", sa.Float(), nullable=True))
        batch_op.add_column(sa.Column("longitude", sa.Float(), nullable=True))


def downgrade():
    with op.batch_alter_table("business_locations") as batch_op:
        batch_op.drop_column("longitude")
        batch_op.drop_column("latitude")
        batch_op.drop_column("place_id")
        batch_op.drop_column("address")
