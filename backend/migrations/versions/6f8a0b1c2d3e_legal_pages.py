"""legal pages

Revision ID: 6f8a0b1c2d3e
Revises: 5e6f7a8b9c0d
Create Date: 2026-09-20 16:30:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '6f8a0b1c2d3e'
down_revision = '5e6f7a8b9c0d'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'legal_pages',
        sa.Column('id', sa.String(length=40), primary_key=True),
        sa.Column('eyebrow', sa.String(length=80), nullable=True),
        sa.Column('title', sa.String(length=200), nullable=True),
        sa.Column('intro', sa.Text(), nullable=True),
        sa.Column('sections', sa.JSON(), nullable=True),
        sa.Column('clauses', sa.JSON(), nullable=True),
        sa.Column('contacts', sa.JSON(), nullable=True),
        sa.Column('last_updated', sa.String(length=40), nullable=True),
        sa.Column('published', sa.Boolean(), nullable=True),
    )


def downgrade():
    op.drop_table('legal_pages')