-- ==========================================================
-- CACHALOT CRM - SCRIPT DE INICIALIZACIÓN DE BASE DE DATOS
-- ==========================================================

-- 1. Tabla de Contactos
CREATE TABLE IF NOT EXISTS contacts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50),
    company VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

-- Índices para optimizar búsquedas frecuentes
CREATE INDEX IF NOT EXISTS idx_contacts_name ON contacts(name);
CREATE INDEX IF NOT EXISTS idx_contacts_company ON contacts(company);
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_deleted_at ON contacts(deleted_at);

-- 2. Tabla de Notas
CREATE TABLE IF NOT EXISTS notes (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    contact_id INTEGER NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

-- Índices para notas
CREATE INDEX IF NOT EXISTS idx_notes_contact_id ON notes(contact_id);
CREATE INDEX IF NOT EXISTS idx_notes_deleted_at ON notes(deleted_at);

-- 3. Semilla de datos iniciales (Seed Data)
INSERT INTO contacts (name, email, phone, company)
VALUES 
    ('Alan Turing', 'alan.turing@enigma.com', '+44 20 7946 0910', 'Bletchley Park'),
    ('Ada Lovelace', 'ada.lovelace@analytical.org', '+44 20 7946 0911', 'Analytical Engine Corp')
ON CONFLICT (email) DO NOTHING;

INSERT INTO notes (content, contact_id)
SELECT 'Contacto inicial sobre optimización de algoritmos y computación.', id 
FROM contacts 
WHERE email = 'alan.turing@enigma.com'
ON CONFLICT DO NOTHING;
