-- Initial database schema for UML Diagram Designer
-- This script is run automatically when the database container starts

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users and Authentication
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects/Diagrams
CREATE TABLE IF NOT EXISTS diagrams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    is_public BOOLEAN DEFAULT FALSE,
    diagram_data JSONB NOT NULL DEFAULT '{}',
    thumbnail_url TEXT,
    version INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Collaboration
CREATE TABLE IF NOT EXISTS diagram_collaborators (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    diagram_id UUID NOT NULL REFERENCES diagrams(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    permission_level VARCHAR(20) NOT NULL CHECK (permission_level IN ('read', 'write', 'admin')),
    invited_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(diagram_id, user_id)
);

-- Real-time collaboration sessions
CREATE TABLE IF NOT EXISTS collaboration_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    diagram_id UUID NOT NULL REFERENCES diagrams(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    socket_id VARCHAR(255),
    cursor_position JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Version history
CREATE TABLE IF NOT EXISTS diagram_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    diagram_id UUID NOT NULL REFERENCES diagrams(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    diagram_data JSONB NOT NULL,
    changes_summary TEXT,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(diagram_id, version_number)
);

-- Activity logs
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    diagram_id UUID REFERENCES diagrams(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50),
    entity_id VARCHAR(255),
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comments and annotations
CREATE TABLE IF NOT EXISTS diagram_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    diagram_id UUID NOT NULL REFERENCES diagrams(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES diagram_comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    position JSONB, -- {x: number, y: number} for positioning on diagram
    element_id VARCHAR(255), -- Reference to UML element if comment is attached to one
    is_resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Templates
CREATE TABLE IF NOT EXISTS diagram_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    template_data JSONB NOT NULL,
    preview_url TEXT,
    is_public BOOLEAN DEFAULT TRUE,
    created_by UUID NOT NULL REFERENCES users(id),
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_diagrams_owner_id ON diagrams(owner_id);
CREATE INDEX IF NOT EXISTS idx_diagrams_created_at ON diagrams(created_at);
CREATE INDEX IF NOT EXISTS idx_diagrams_is_public ON diagrams(is_public);

CREATE INDEX IF NOT EXISTS idx_collaborators_diagram_id ON diagram_collaborators(diagram_id);
CREATE INDEX IF NOT EXISTS idx_collaborators_user_id ON diagram_collaborators(user_id);

CREATE INDEX IF NOT EXISTS idx_sessions_diagram_id ON collaboration_sessions(diagram_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON collaboration_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_active ON collaboration_sessions(is_active);

CREATE INDEX IF NOT EXISTS idx_versions_diagram_id ON diagram_versions(diagram_id);
CREATE INDEX IF NOT EXISTS idx_versions_created_at ON diagram_versions(created_at);

CREATE INDEX IF NOT EXISTS idx_activity_logs_diagram_id ON activity_logs(diagram_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at);

CREATE INDEX IF NOT EXISTS idx_comments_diagram_id ON diagram_comments(diagram_id);
CREATE INDEX IF NOT EXISTS idx_comments_element_id ON diagram_comments(element_id);

CREATE INDEX IF NOT EXISTS idx_templates_category ON diagram_templates(category);
CREATE INDEX IF NOT EXISTS idx_templates_public ON diagram_templates(is_public);

-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_diagrams_updated_at 
    BEFORE UPDATE ON diagrams 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at 
    BEFORE UPDATE ON diagram_comments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default data
INSERT INTO users (id, email, username, password_hash, first_name, last_name) 
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'demo@example.com',
    'demo',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewIvQx4lKK2E2B4W', -- password: 'demo123'
    'Demo',
    'User'
) ON CONFLICT (email) DO NOTHING;

-- Insert sample templates
INSERT INTO diagram_templates (id, name, description, category, template_data, created_by) 
VALUES (
    uuid_generate_v4(),
    'Basic Class Diagram',
    'Simple class diagram template with basic UML elements',
    'Educational',
    '{"classes": [], "interfaces": [], "relationships": [], "notes": []}',
    '00000000-0000-0000-0000-000000000001'
) ON CONFLICT DO NOTHING;

INSERT INTO diagram_templates (id, name, description, category, template_data, created_by) 
VALUES (
    uuid_generate_v4(),
    'MVC Pattern',
    'Model-View-Controller architecture template',
    'Design Patterns',
    '{"classes": [{"name": "Model", "x": 100, "y": 100}, {"name": "View", "x": 300, "y": 100}, {"name": "Controller", "x": 200, "y": 250}], "interfaces": [], "relationships": [], "notes": []}',
    '00000000-0000-0000-0000-000000000001'
) ON CONFLICT DO NOTHING;

-- Grant permissions (for development)
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;

-- Print completion message
DO $$
BEGIN
    RAISE NOTICE 'Database initialization completed successfully!';
    RAISE NOTICE 'Default user created: demo@example.com / demo123';
END $$;