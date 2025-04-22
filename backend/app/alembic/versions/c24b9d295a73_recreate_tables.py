"""Recreate tables

Revision ID: c24b9d295a73
Revises: ff81133b0433
Create Date: 2025-04-21 16:25:52.222431

"""
from typing import Sequence, Union
from sqlalchemy.dialects import postgresql

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c24b9d295a73'
down_revision: Union[str, None] = 'ff81133b0433'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None
def upgrade() -> None:
    """Upgrade schema."""
    # Use SQL to check if the table exists before trying to drop it
    op.execute("DROP TABLE IF EXISTS nutrition_history CASCADE")
    op.execute("DROP TABLE IF EXISTS users CASCADE")
    op.execute("DROP TABLE IF EXISTS nutrition_goals CASCADE")
    op.execute("DROP TABLE IF EXISTS daily_hydration CASCADE")
    op.execute("DROP TABLE IF EXISTS daily_nutrition CASCADE")

    # Recreate the 'users' table
    op.create_table('users',
        sa.Column('id', sa.INTEGER(), server_default=sa.text("nextval('users_id_seq'::regclass)"), autoincrement=True, nullable=False),
        sa.Column('first_name', sa.VARCHAR(), nullable=True),
        sa.Column('last_name', sa.VARCHAR(), nullable=True),
        sa.Column('email', sa.VARCHAR(), nullable=True),
        sa.Column('password', sa.VARCHAR(), nullable=True),
        sa.Column('username', sa.VARCHAR(), nullable=True),
        sa.Column('dob', sa.DATE(), nullable=True),
        sa.PrimaryKeyConstraint('id', name='users_pkey'),
        postgresql_ignore_search_path=False
    )
    op.create_index('ix_users_email', 'users', ['email'], unique=True)
    op.create_index('ix_users_first_name', 'users', ['first_name'], unique=False)
    op.create_index('ix_users_id', 'users', ['id'], unique=False)
    op.create_index('ix_users_last_name', 'users', ['last_name'], unique=False)
    op.create_index('ix_users_username', 'users', ['username'], unique=True)

    # Recreate the 'nutrition_goals' table
    op.create_table('nutrition_goals',
        sa.Column('user_id', sa.INTEGER(), nullable=False),
        sa.Column('daily_calories', sa.INTEGER(), nullable=False),
        sa.Column('water_goal_ml', sa.INTEGER(), nullable=False),
        sa.Column('fat_goal', sa.INTEGER(), nullable=False),
        sa.Column('protein_goal', sa.INTEGER(), nullable=False),
        sa.Column('carbs_goal', sa.INTEGER(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], name='nutrition_goals_user_id_fkey'),
        sa.PrimaryKeyConstraint('user_id', name='nutrition_goals_pkey')
    )

    # Recreate the 'daily_hydration' table
    op.create_table('daily_hydration',
        sa.Column('record_id', sa.INTEGER(), autoincrement=True, nullable=False),
        sa.Column('user_id', sa.INTEGER(), nullable=False),
        sa.Column('record_date', sa.DATE(), server_default=sa.text('CURRENT_DATE'), nullable=False),
        sa.Column('water_ml', sa.INTEGER(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], name='daily_hydration_user_id_fkey'),
        sa.PrimaryKeyConstraint('record_id', name='daily_hydration_pkey')
    )
    op.create_index('ix_daily_hydration_record_id', 'daily_hydration', ['record_id'], unique=False)

    # Recreate the 'daily_nutrition' table
    op.create_table('daily_nutrition',
        sa.Column('record_id', sa.INTEGER(), autoincrement=True, nullable=False),
        sa.Column('user_id', sa.INTEGER(), nullable=False),
        sa.Column('record_date', sa.DATE(), server_default=sa.text('CURRENT_DATE'), nullable=False),
        sa.Column('consumed_calories', sa.INTEGER(), nullable=False),
        sa.Column('fat_consumed', sa.INTEGER(), nullable=False),
        sa.Column('protein_consumed', sa.INTEGER(), nullable=False),
        sa.Column('carbs_consumed', sa.INTEGER(), nullable=False),
        sa.Column('meal_name', sa.VARCHAR(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], name='daily_nutrition_user_id_fkey'),
        sa.PrimaryKeyConstraint('record_id', name='daily_nutrition_pkey')
    )
    op.create_index('ix_daily_nutrition_record_id', 'daily_nutrition', ['record_id'], unique=False)

    # Recreate the 'nutrition_history' table
    op.create_table('nutrition_history',
        sa.Column('history_id', sa.INTEGER(), autoincrement=True, nullable=False),
        sa.Column('user_id', sa.INTEGER(), nullable=False),
        sa.Column('table_affected', sa.VARCHAR(length=50), nullable=False),
        sa.Column('record_id', sa.INTEGER(), nullable=False),
        sa.Column('action', sa.VARCHAR(length=20), nullable=False),
        sa.Column('changed_fields', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('timestamp', postgresql.TIMESTAMP(), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], name='nutrition_history_user_id_fkey'),
        sa.PrimaryKeyConstraint('history_id', name='nutrition_history_pkey')
    )
    op.create_index('ix_nutrition_history_history_id', 'nutrition_history', ['history_id'], unique=False)


def downgrade() -> None:
    """Downgrade schema."""
    # Drop the recreated tables during downgrade
    op.drop_table('nutrition_history')
    op.drop_table('users')
    op.drop_table('nutrition_goals')
    op.drop_table('daily_hydration')
    op.drop_table('daily_nutrition')
