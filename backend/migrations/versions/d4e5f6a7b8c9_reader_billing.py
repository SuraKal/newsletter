"""reader billing

Revision ID: d4e5f6a7b8c9
Revises: c1d2e3f4a5b6
Create Date: 2026-09-20 13:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'd4e5f6a7b8c9'
down_revision = 'c1d2e3f4a5b6'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'reader_billing',
        sa.Column('id', sa.String(length=36), primary_key=True),
        sa.Column(
            'user_id',
            sa.Integer(),
            sa.ForeignKey('users.id', ondelete='CASCADE'),
            nullable=False,
        ),
        sa.Column('entry_type', sa.String(length=30), nullable=True),
        sa.Column('reference', sa.String(length=80), nullable=True),
        sa.Column('amount', sa.Numeric(precision=10, scale=2), nullable=True),
        sa.Column('currency', sa.String(length=8), nullable=True),
        sa.Column('method', sa.String(length=40), nullable=True),
        sa.Column('status', sa.String(length=30), nullable=True),
        sa.Column('event_at', sa.DateTime(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
    )
    op.create_index(
        op.f('ix_reader_billing_user_id'),
        'reader_billing',
        ['user_id'],
        unique=False,
    )


def downgrade():
    op.drop_index(
        op.f('ix_reader_billing_user_id'),
        table_name='reader_billing',
    )
    op.drop_table('reader_billing')