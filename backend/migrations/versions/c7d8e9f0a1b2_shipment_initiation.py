"""shipment initiation fields

Revision ID: c7d8e9f0a1b2
Revises: 9a1b2c3d4e5f
Create Date: 2026-09-22 10:30:00.000000

Adds the columns that let a shipment run be initiated from an approved
bulk-order request (or manually from scratch) and records how it started.

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "c7d8e9f0a1b2"
down_revision = "9a1b2c3d4e5f"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
        "shipments",
        sa.Column("source_type", sa.String(length=30), nullable=True),
    )
    op.add_column(
        "shipments",
        sa.Column("order_request_id", sa.String(length=36), nullable=True),
    )
    op.add_column(
        "shipments",
        sa.Column("notes", sa.String(length=500), nullable=True),
    )
    op.add_column(
        "shipments",
        sa.Column("delivery_locations", sa.JSON(), nullable=True),
    )
    op.create_index(
        op.f("ix_shipments_order_request_id"),
        "shipments",
        ["order_request_id"],
        unique=True,
    )
    op.create_foreign_key(
        "fk_shipments_order_request_id",
        "shipments",
        "company_orders",
        ["order_request_id"],
        ["id"],
        ondelete="SET NULL",
    )


def downgrade():
    op.drop_constraint(
        "fk_shipments_order_request_id",
        "shipments",
        type_="foreignkey",
    )
    op.drop_index(
        op.f("ix_shipments_order_request_id"),
        table_name="shipments",
    )
    op.drop_column("shipments", "delivery_locations")
    op.drop_column("shipments", "notes")
    op.drop_column("shipments", "order_request_id")
    op.drop_column("shipments", "source_type")