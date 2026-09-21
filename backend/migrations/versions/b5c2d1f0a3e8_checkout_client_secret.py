"""checkout client secret

Revision ID: b5c2d1f0a3e8
Revises: 6f8a0b1c2d3e
Create Date: 2026-09-20 21:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b5c2d1f0a3e8'
down_revision = '6f8a0b1c2d3e'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
        'checkout_sessions',
        sa.Column('client_secret', sa.String(length=255), nullable=True),
    )


def downgrade():
    op.drop_column('checkout_sessions', 'client_secret')