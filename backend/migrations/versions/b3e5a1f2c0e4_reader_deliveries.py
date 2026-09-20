"""reader deliveries

Revision ID: b3e5a1f2c0e4
Revises: a2b4c6d8e0f2
Create Date: 2026-09-20 11:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b3e5a1f2c0e4'
down_revision = 'a2b4c6d8e0f2'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'reader_deliveries',
        sa.Column('id', sa.String(length=36), primary_key=True),
        sa.Column(
            'user_id',
            sa.Integer(),
            sa.ForeignKey('users.id', ondelete='CASCADE'),
            nullable=False,
        ),
        sa.Column('tracking_id', sa.String(length=40), nullable=True),
        sa.Column('edition', sa.String(length=120), nullable=True),
        sa.Column('status', sa.String(length=50), nullable=True),
        sa.Column('eta', sa.String(length=160), nullable=True),
        sa.Column('date', sa.String(length=160), nullable=True),
        sa.Column('note', sa.String(length=300), nullable=True),
        sa.Column('sort_order', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
    )
    op.create_index(
        op.f('ix_reader_deliveries_user_id'),
        'reader_deliveries',
        ['user_id'],
        unique=False,
    )
    op.create_index(
        op.f('ix_reader_deliveries_tracking_id'),
        'reader_deliveries',
        ['tracking_id'],
        unique=False,
    )
    op.create_table(
        'reader_delivery_activity',
        sa.Column('id', sa.String(length=36), primary_key=True),
        sa.Column(
            'delivery_id',
            sa.String(length=36),
            sa.ForeignKey('reader_deliveries.id', ondelete='CASCADE'),
            nullable=False,
        ),
        sa.Column('sort_order', sa.Integer(), nullable=True),
        sa.Column('label', sa.String(length=120), nullable=True),
        sa.Column('description', sa.String(length=300), nullable=True),
        sa.Column('badge', sa.String(length=30), nullable=True),
        sa.Column('status', sa.String(length=30), nullable=True),
        sa.Column('tone', sa.String(length=30), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
    )
    op.create_index(
        op.f('ix_reader_delivery_activity_delivery_id'),
        'reader_delivery_activity',
        ['delivery_id'],
        unique=False,
    )


def downgrade():
    op.drop_index(
        op.f('ix_reader_delivery_activity_delivery_id'),
        table_name='reader_delivery_activity',
    )
    op.drop_table('reader_delivery_activity')
    op.drop_index(
        op.f('ix_reader_deliveries_tracking_id'),
        table_name='reader_deliveries',
    )
    op.drop_index(
        op.f('ix_reader_deliveries_user_id'),
        table_name='reader_deliveries',
    )
    op.drop_table('reader_deliveries')