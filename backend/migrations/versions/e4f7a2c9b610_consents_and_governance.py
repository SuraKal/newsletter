"""consent preferences and governance requests

Revision ID: e4f7a2c9b610
Revises: d8e1b4c9a250
Create Date: 2026-09-19 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e4f7a2c9b610'
down_revision = 'd8e1b4c9a250'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'governance_requests',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=True),
        sa.Column('company_account_id', sa.String(length=36), nullable=True),
        sa.Column('scope', sa.String(length=30), nullable=True),
        sa.Column('type', sa.String(length=80), nullable=True),
        sa.Column('status', sa.String(length=40), nullable=True),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('resolved_at', sa.DateTime(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(
            ['user_id'], ['users.id'], ondelete='SET NULL'
        ),
        sa.ForeignKeyConstraint(
            ['company_account_id'], ['company_accounts.id'], ondelete='SET NULL'
        ),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(
        op.f('ix_governance_requests_user_id'),
        'governance_requests',
        ['user_id'],
        unique=False,
    )
    op.create_index(
        op.f('ix_governance_requests_company_account_id'),
        'governance_requests',
        ['company_account_id'],
        unique=False,
    )

    op.add_column(
        'users',
        sa.Column(
            'newsletter_opt_in',
            sa.Boolean(),
            nullable=False,
            server_default=sa.false(),
        ),
    )
    op.add_column(
        'users',
        sa.Column(
            'privacy_updates_opt_in',
            sa.Boolean(),
            nullable=False,
            server_default=sa.true(),
        ),
    )
    op.add_column(
        'users',
        sa.Column(
            'delivery_data_consent',
            sa.Boolean(),
            nullable=False,
            server_default=sa.true(),
        ),
    )
    op.add_column(
        'users',
        sa.Column(
            'commercial_updates_opt_in',
            sa.Boolean(),
            nullable=False,
            server_default=sa.false(),
        ),
    )

    op.add_column(
        'company_accounts',
        sa.Column(
            'privacy_updates_opt_in',
            sa.Boolean(),
            nullable=False,
            server_default=sa.true(),
        ),
    )
    op.add_column(
        'company_accounts',
        sa.Column(
            'delivery_data_consent',
            sa.Boolean(),
            nullable=False,
            server_default=sa.true(),
        ),
    )
    op.add_column(
        'company_accounts',
        sa.Column(
            'commercial_updates_opt_in',
            sa.Boolean(),
            nullable=False,
            server_default=sa.false(),
        ),
    )


def downgrade():
    op.drop_column('company_accounts', 'commercial_updates_opt_in')
    op.drop_column('company_accounts', 'delivery_data_consent')
    op.drop_column('company_accounts', 'privacy_updates_opt_in')

    op.drop_column('users', 'commercial_updates_opt_in')
    op.drop_column('users', 'delivery_data_consent')
    op.drop_column('users', 'privacy_updates_opt_in')
    op.drop_column('users', 'newsletter_opt_in')

    op.drop_index(
        op.f('ix_governance_requests_company_account_id'),
        table_name='governance_requests',
    )
    op.drop_index(
        op.f('ix_governance_requests_user_id'),
        table_name='governance_requests',
    )
    op.drop_table('governance_requests')
