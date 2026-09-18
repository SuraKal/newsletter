"""company order required-by date

Revision ID: d8e1b4c9a250
Revises: c2f5a1d8b730
Create Date: 2026-09-17 13:40:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'd8e1b4c9a250'
down_revision = 'c2f5a1d8b730'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
        'company_orders',
        sa.Column('needed_by', sa.String(length=20), nullable=True),
    )
    op.drop_column('company_orders', 'cadence')


def downgrade():
    op.add_column(
        'company_orders',
        sa.Column('cadence', sa.String(length=80), nullable=True),
    )
    op.drop_column('company_orders', 'needed_by')