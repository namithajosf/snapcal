"""Initial migration

Revision ID: 0693d69f862f
Revises: 
Create Date: 2025-04-22 10:25:39.490182

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.sql import func


# revision identifiers, used by Alembic.
revision = '0693d69f862f'
down_revision = None  # if this is your first migration, otherwise specify previous revision
branch_labels = None
depends_on = None


def upgrade():
    # Create the 'users' table
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), primary_key=True, index=True),
        sa.Column('first_name', sa.String(), index=True),
        sa.Column('last_name', sa.String(), index=True),
        sa.Column('email', sa.String(), unique=True, index=True),
        sa.Column('password', sa.String()),
        sa.Column('username', sa.String(), unique=True, index=True),
        sa.Column('dob', sa.Date()),
    )

    # Create the 'daily_nutrition' table
    op.create_table(
        'daily_nutrition',
        sa.Column('id', sa.Integer(), primary_key=True, index=True),
        sa.Column('user_id', sa.Integer(), sa.ForeignKey('users.id')),
        sa.Column('record_date', sa.Date(), default=func.current_date()),
        sa.Column('meal_name', sa.String()),
        sa.Column('consumed_calories', sa.Integer()),
        sa.Column('fat_consumed', sa.Float()),
        sa.Column('protein_consumed', sa.Float()),
        sa.Column('carbs_consumed', sa.Float()),
        sa.Column('meal_type', sa.String(), default='Other'),
    )

    # Create the 'daily_hydration' table
    op.create_table(
        'daily_hydration',
        sa.Column('record_id', sa.Integer(), primary_key=True, index=True),
        sa.Column('user_id', sa.Integer(), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('record_date', sa.Date(), server_default=func.current_date(), nullable=False),
        sa.Column('water_ml', sa.Integer(), default=0, nullable=False),
    )

    # Create the 'nutrition_goals' table
    op.create_table(
        'nutrition_goals',
        sa.Column('user_id', sa.Integer(), sa.ForeignKey('users.id'), primary_key=True),
        sa.Column('daily_calories', sa.Integer(), nullable=False),
        sa.Column('water_goal_ml', sa.Integer(), nullable=False),
        sa.Column('fat_goal', sa.Integer(), nullable=False),
        sa.Column('protein_goal', sa.Integer(), nullable=False),
        sa.Column('carbs_goal', sa.Integer(), nullable=False),
    )

    # Create the 'nutrition_history' table
    op.create_table(
        'nutrition_history',
        sa.Column('history_id', sa.Integer(), primary_key=True, index=True),
        sa.Column('user_id', sa.Integer(), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('table_affected', sa.String(50), nullable=False),
        sa.Column('record_id', sa.Integer(), nullable=False),
        sa.Column('action', sa.String(20), nullable=False),
        sa.Column('changed_fields', sa.JSON()),
        sa.Column('timestamp', sa.TIMESTAMP(), server_default=func.now()),
    )


def downgrade():
    # Drop the 'nutrition_history' table
    op.drop_table('nutrition_history')

    # Drop the 'nutrition_goals' table
    op.drop_table('nutrition_goals')

    # Drop the 'daily_hydration' table
    op.drop_table('daily_hydration')

    # Drop the 'daily_nutrition' table
    op.drop_table('daily_nutrition')

    # Drop the 'users' table
    op.drop_table('users')
