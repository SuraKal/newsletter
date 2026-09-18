"""company order article reference

Revision ID: c2f5a1d8b730
Revises: a7c3f0b2e914
Create Date: 2026-09-17 13:10:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'c2f5a1d8b730'
down_revision = 'a7c3f0b2e914'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
        'company_orders',
        sa.Column('article_id', sa.String(length=36), nullable=True),
    )
    op.add_column(
        'company_orders',
        sa.Column('article_title', sa.String(length=255), nullable=True),
    )
    op.create_index(
        op.f('ix_company_orders_article_id'),
        'company_orders',
        ['article_id'],
        unique=False,
    )
    op.create_foreign_key(
        'fk_company_orders_article_id',
        'company_orders',
        'articles',
        ['article_id'],
        ['id'],
        ondelete='SET NULL',
    )


def downgrade():
    op.drop_constraint(
        'fk_company_orders_article_id', 'company_orders', type_='foreignkey'
    )
    op.drop_index(
        op.f('ix_company_orders_article_id'), table_name='company_orders'
    )
    op.drop_column('company_orders', 'article_title')
    op.drop_column('company_orders', 'article_id')