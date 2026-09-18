"""company order requests and drop tier

Revision ID: 036c75a5d1c2
Revises: d4e84c7a9f21
Create Date: 2026-09-17 11:45:20.188684

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '036c75a5d1c2'
down_revision = 'd4e84c7a9f21'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'company_orders',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('company_account_id', sa.String(length=36), nullable=False),
        sa.Column('requested_by_user_id', sa.Integer(), nullable=True),
        sa.Column('copies', sa.Integer(), nullable=False),
        sa.Column('cadence', sa.String(length=80), nullable=True),
        sa.Column('delivery_locations', sa.JSON(), nullable=True),
        sa.Column('estimated_price', sa.Numeric(12, 2), nullable=True),
        sa.Column('rate', sa.Numeric(6, 2), nullable=True),
        sa.Column('status', sa.String(length=50), nullable=True),
        sa.Column('final_price', sa.Numeric(12, 2), nullable=True),
        sa.Column('reviewed_by_user_id', sa.Integer(), nullable=True),
        sa.Column('reviewed_at', sa.DateTime(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['company_account_id'], ['company_accounts.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['requested_by_user_id'], ['users.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(
        op.f('ix_company_orders_company_account_id'),
        'company_orders',
        ['company_account_id'],
        unique=False,
    )
    op.drop_column('company_accounts', 'tier')


def downgrade():
    op.add_column(
        'company_accounts',
        sa.Column('tier', sa.String(length=50), nullable=True),
    )
    op.drop_index(
        op.f('ix_company_orders_company_account_id'),
        table_name='company_orders',
    )
    op.drop_table('company_orders')