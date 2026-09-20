"""reading history

Revision ID: c1d2e3f4a5b6
Revises: b3e5a1f2c0e4
Create Date: 2026-09-20 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'c1d2e3f4a5b6'
down_revision = 'b3e5a1f2c0e4'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'reading_history',
        sa.Column('id', sa.String(length=36), primary_key=True),
        sa.Column(
            'user_id',
            sa.Integer(),
            sa.ForeignKey('users.id', ondelete='CASCADE'),
            nullable=False,
        ),
        sa.Column('article_id', sa.String(length=80), nullable=True),
        sa.Column('title', sa.String(length=200), nullable=True),
        sa.Column('category', sa.String(length=80), nullable=True),
        sa.Column('state', sa.String(length=30), nullable=True),
        sa.Column('saved', sa.Boolean(), nullable=True),
        sa.Column('last_read_at', sa.DateTime(), nullable=True),
        sa.Column('last_shared_at', sa.DateTime(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
    )
    op.create_index(
        op.f('ix_reading_history_user_id'),
        'reading_history',
        ['user_id'],
        unique=False,
    )
    op.create_index(
        op.f('ix_reading_history_article_id'),
        'reading_history',
        ['article_id'],
        unique=False,
    )


def downgrade():
    op.drop_index(
        op.f('ix_reading_history_article_id'),
        table_name='reading_history',
    )
    op.drop_index(
        op.f('ix_reading_history_user_id'),
        table_name='reading_history',
    )
    op.drop_table('reading_history')