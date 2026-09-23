"""invoice source linkage

Revision ID: e0f1a2b3c4d5
Revises: c7d8e9f0a1b2
Create Date: 2026-09-23 09:00:00.000000

Adds the fields that tie a business invoice to a real billing source (an
approved bulk order or the company owner's business subscription) with a
numeric amount and currency backing the display string.

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "e0f1a2b3c4d5"
down_revision = "c7d8e9f0a1b2"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
        "business_invoices",
        sa.Column("source_type", sa.String(length=30), nullable=True),
    )
    op.add_column(
        "business_invoices",
        sa.Column("source_id", sa.String(length=36), nullable=True),
    )
    op.add_column(
        "business_invoices",
        sa.Column("amount_value", sa.Numeric(12, 2), nullable=True),
    )
    op.add_column(
        "business_invoices",
        sa.Column("currency", sa.String(length=8), nullable=True),
    )
    op.create_index(
        op.f("ix_business_invoices_source_type"),
        "business_invoices",
        ["source_type"],
        unique=False,
    )
    op.create_index(
        op.f("ix_business_invoices_source_id"),
        "business_invoices",
        ["source_id"],
        unique=False,
    )


def downgrade():
    op.drop_index(
        op.f("ix_business_invoices_source_id"),
        table_name="business_invoices",
    )
    op.drop_index(
        op.f("ix_business_invoices_source_type"),
        table_name="business_invoices",
    )
    op.drop_column("business_invoices", "currency")
    op.drop_column("business_invoices", "amount_value")
    op.drop_column("business_invoices", "source_id")
    op.drop_column("business_invoices", "source_type")