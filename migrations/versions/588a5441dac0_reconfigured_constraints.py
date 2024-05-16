"""reconfigured constraints

Revision ID: 588a5441dac0
Revises: 3679acc4fa26
Create Date: 2024-05-16 17:08:33.220862

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '588a5441dac0'
down_revision = '3679acc4fa26'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('mission', schema=None) as batch_op:
        batch_op.alter_column('title',
               existing_type=sa.VARCHAR(length=100),
               nullable=False)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('mission', schema=None) as batch_op:
        batch_op.alter_column('title',
               existing_type=sa.VARCHAR(length=100),
               nullable=True)

    # ### end Alembic commands ###
