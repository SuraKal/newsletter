"""business order plans and invoices

Revision ID: a7c3f0b2e914
Revises: d1ba4e69c302
Create Date: 2026-09-17 12:35:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a7c3f0b2e914'
down_revision = 'd1ba4e69c302'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'business_orders',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('company_account_id', sa.String(length=36), nullable=False),
        sa.Column('order', sa.String(length=160), nullable=False),
        sa.Column('copies', sa.String(length=40), nullable=True),
        sa.Column('cadence', sa.String(length=80), nullable=True),
        sa.Column('sites', sa.String(length=40), nullable=True),
        sa.Column('status', sa.String(length=50), nullable=True),
        sa.Column('next_window', sa.String(length=120), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['company_account_id'], ['company_accounts.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(
        op.f('ix_business_orders_company_account_id'),
        'business_orders',
        ['company_account_id'],
        unique=False,
    )
    op.create_table(
        'business_invoices',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('company_account_id', sa.String(length=36), nullable=False),
        sa.Column('invoice', sa.String(length=80), nullable=False),
        sa.Column('scope', sa.String(length=160), nullable=True),
        sa.Column('amount', sa.String(length=40), nullable=True),
        sa.Column('status', sa.String(length=50), nullable=True),
        sa.Column('date', sa.String(length=80), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['company_account_id'], ['company_accounts.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(
        op.f('ix_business_invoices_company_account_id'),
        'business_invoices',
        ['company_account_id'],
        unique=False,
    )


def downgrade():
    op.drop_index(
        op.f('ix_business_invoices_company_account_id'),
        table_name='business_invoices',
    )
    op.drop_table('business_invoices')
    op.drop_index(
        op.f('ix_business_orders_company_account_id'),
        table_name='business_orders',
    )
    op.drop_table('business_orders')