"""checkout sessions

Revision ID: 5e6f7a8b9c0d
Revises: d4e5f6a7b8c9
Create Date: 2026-09-20 15:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '5e6f7a8b9c0d'
down_revision = 'd4e5f6a7b8c9'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'checkout_sessions',
        sa.Column('id', sa.String(length=40), primary_key=True),
        sa.Column(
            'user_id',
            sa.Integer(),
            sa.ForeignKey('users.id', ondelete='CASCADE'),
            nullable=True,
        ),
        sa.Column(
            'plan_id',
            sa.String(length=50),
            sa.ForeignKey('subscription_plans.id'),
            nullable=True,
        ),
        sa.Column('billing_cycle', sa.String(length=20), nullable=True),
        sa.Column('amount', sa.Numeric(precision=10, scale=2), nullable=True),
        sa.Column('currency', sa.String(length=8), nullable=True),
        sa.Column('status', sa.String(length=30), nullable=True),
        sa.Column('payment_status', sa.String(length=30), nullable=True),
        sa.Column('payment_method', sa.String(length=30), nullable=True),
        sa.Column('customer_name', sa.String(length=120), nullable=True),
        sa.Column('customer_email', sa.String(length=200), nullable=True),
        sa.Column('delivery', sa.JSON(), nullable=True),
        sa.Column('consents', sa.JSON(), nullable=True),
        sa.Column('quote_mode', sa.String(length=80), nullable=True),
        sa.Column('quote_window', sa.String(length=160), nullable=True),
        sa.Column('quote_next_charge', sa.String(length=80), nullable=True),
        sa.Column('intent_id', sa.String(length=80), nullable=True),
        sa.Column('card_brand', sa.String(length=30), nullable=True),
        sa.Column('last4', sa.String(length=4), nullable=True),
        sa.Column('paypal_email', sa.String(length=200), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('expires_at', sa.DateTime(), nullable=True),
        sa.Column('confirmed_at', sa.DateTime(), nullable=True),
    )
    op.create_index(
        op.f('ix_checkout_sessions_user_id'),
        'checkout_sessions',
        ['user_id'],
        unique=False,
    )
    op.create_index(
        op.f('ix_checkout_sessions_plan_id'),
        'checkout_sessions',
        ['plan_id'],
        unique=False,
    )


def downgrade():
    op.drop_index(
        op.f('ix_checkout_sessions_plan_id'),
        table_name='checkout_sessions',
    )
    op.drop_index(
        op.f('ix_checkout_sessions_user_id'),
        table_name='checkout_sessions',
    )
    op.drop_table('checkout_sessions')