"""business licence approval

Revision ID: d4e84c7a9f21
Revises: beb4059efc00
Create Date: 2026-09-16
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql


revision = "d4e84c7a9f21"
down_revision = "beb4059efc00"
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table("users") as batch_op:
        batch_op.add_column(
            sa.Column(
                "business_access_approved",
                sa.Boolean(),
                nullable=False,
                server_default=sa.true(),
            )
        )
    with op.batch_alter_table("company_accounts") as batch_op:
        batch_op.add_column(sa.Column("license_document", mysql.MEDIUMTEXT(), nullable=True))
        batch_op.add_column(sa.Column("license_reviewed_at", sa.DateTime(), nullable=True))


def downgrade():
    with op.batch_alter_table("company_accounts") as batch_op:
        batch_op.drop_column("license_reviewed_at")
        batch_op.drop_column("license_document")
    with op.batch_alter_table("users") as batch_op:
        batch_op.drop_column("business_access_approved")
