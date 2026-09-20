"""reader profile fields

Revision ID: a2b4c6d8e0f2
Revises: f7b3d1c8e920
Create Date: 2026-09-20 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a2b4c6d8e0f2'
down_revision = 'f7b3d1c8e920'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('users', sa.Column('contact_phone', sa.String(length=40), nullable=True))
    op.add_column('users', sa.Column('delivery_address', sa.String(length=200), nullable=True))
    op.add_column('users', sa.Column('city', sa.String(length=120), nullable=True))
    op.add_column('users', sa.Column('postal_code', sa.String(length=40), nullable=True))
    op.add_column('users', sa.Column('country', sa.String(length=120), nullable=True))


def downgrade():
    op.drop_column('users', 'country')
    op.drop_column('users', 'postal_code')
    op.drop_column('users', 'city')
    op.drop_column('users', 'delivery_address')
    op.drop_column('users', 'contact_phone')