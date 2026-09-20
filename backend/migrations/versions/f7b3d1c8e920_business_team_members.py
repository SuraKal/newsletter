"""business team members

Revision ID: f7b3d1c8e920
Revises: e4f7a2c9b610
Create Date: 2026-09-19 11:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f7b3d1c8e920'
down_revision = 'e4f7a2c9b610'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'business_team_members',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('company_account_id', sa.String(length=36), nullable=False),
        sa.Column('name', sa.String(length=160), nullable=False),
        sa.Column('role', sa.String(length=120), nullable=True),
        sa.Column('scope', sa.String(length=160), nullable=True),
        sa.Column('status', sa.String(length=40), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(
            ['company_account_id'],
            ['company_accounts.id'],
            ondelete='CASCADE',
        ),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(
        op.f('ix_business_team_members_company_account_id'),
        'business_team_members',
        ['company_account_id'],
        unique=False,
    )


def downgrade():
    op.drop_index(
        op.f('ix_business_team_members_company_account_id'),
        table_name='business_team_members',
    )
    op.drop_table('business_team_members')
