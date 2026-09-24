"""site settings

Revision ID: 9a1b2c3d4e5f
Revises: b5c2d1f0a3e8, beb4059efc00
Create Date: 2026-09-22 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "9a1b2c3d4e5f"
down_revision = ("b5c2d1f0a3e8", "9ab4c7d2e130")
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "site_settings",
        sa.Column("key", sa.String(length=60), primary_key=True),
        sa.Column("value", sa.Text(), nullable=True),
        sa.Column("updated_at", sa.DateTime(), nullable=True),
    )


def downgrade():
    op.drop_table("site_settings")