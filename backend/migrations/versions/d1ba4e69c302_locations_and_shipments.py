"""business locations and shipment runs

Revision ID: d1ba4e69c302
Revises: 036c75a5d1c2
Create Date: 2026-09-17 12:05:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'd1ba4e69c302'
down_revision = '036c75a5d1c2'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'business_locations',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('company_account_id', sa.String(length=36), nullable=False),
        sa.Column('location', sa.String(length=120), nullable=False),
        sa.Column('region', sa.String(length=80), nullable=True),
        sa.Column('copies', sa.String(length=40), nullable=True),
        sa.Column('contact', sa.String(length=120), nullable=True),
        sa.Column('status', sa.String(length=50), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['company_account_id'], ['company_accounts.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(
        op.f('ix_business_locations_company_account_id'),
        'business_locations',
        ['company_account_id'],
        unique=False,
    )
    op.create_table(
        'shipments',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('company_account_id', sa.String(length=36), nullable=True),
        sa.Column('shipment_id', sa.String(length=40), nullable=True),
        sa.Column('label', sa.String(length=200), nullable=True),
        sa.Column('route', sa.String(length=120), nullable=True),
        sa.Column('scope', sa.String(length=120), nullable=True),
        sa.Column('status', sa.String(length=50), nullable=True),
        sa.Column('eta', sa.String(length=120), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['company_account_id'], ['company_accounts.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(
        op.f('ix_shipments_company_account_id'),
        'shipments',
        ['company_account_id'],
        unique=False,
    )
    op.create_index(
        op.f('ix_shipments_shipment_id'),
        'shipments',
        ['shipment_id'],
        unique=False,
    )
    op.create_table(
        'shipment_activity',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('shipment_id', sa.String(length=36), nullable=False),
        sa.Column('event', sa.String(length=200), nullable=True),
        sa.Column('status', sa.String(length=50), nullable=True),
        sa.Column('tone', sa.String(length=30), nullable=True),
        sa.Column('date', sa.String(length=120), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['shipment_id'], ['shipments.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(
        op.f('ix_shipment_activity_shipment_id'),
        'shipment_activity',
        ['shipment_id'],
        unique=False,
    )


def downgrade():
    op.drop_index(
        op.f('ix_shipment_activity_shipment_id'),
        table_name='shipment_activity',
    )
    op.drop_table('shipment_activity')
    op.drop_index(
        op.f('ix_shipments_shipment_id'),
        table_name='shipments',
    )
    op.drop_index(
        op.f('ix_shipments_company_account_id'),
        table_name='shipments',
    )
    op.drop_table('shipments')
    op.drop_index(
        op.f('ix_business_locations_company_account_id'),
        table_name='business_locations',
    )
    op.drop_table('business_locations')