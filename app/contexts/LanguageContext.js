'use client'

import { createContext, useContext, useEffect, useState } from 'react'

const translations = {
  es: {
    // Spanish
    login: 'Iniciar Sesión',
    email: 'Correo electrónico',
    password: 'Contraseña',
    loginButton: 'Iniciar Sesión',
    welcome: 'Bienvenido',
    role: 'Rol',
    adminPanel: 'Panel de Administración',
    manageUsers: 'Administrar Usuarios',
    manageContent: 'Administrar Contenido',
    manageCategories: 'Administrar Categorías',
    categories: 'Categorías',
    recentResources: 'Recursos Recientes',
    resources: 'Recursos',
    title: 'Título',
    description: 'Descripción',
    type: 'Tipo',
    category: 'Categoría',
    permissions: 'Permisos',
    actions: 'Acciones',
    addNewUser: 'Agregar Nuevo Usuario',
    name: 'Nombre',
    addUser: 'Agregar Usuario',
    addNewResource: 'Agregar Nuevo Recurso',
    url: 'URL',
    allUsers: 'Todos los usuarios',
    adminOnly: 'Solo administradores',
    agentOnly: 'Solo agentes',
    addResource: 'Agregar Recurso',
    backToHome: '← Volver al Inicio',
    logout: 'Cerrar Sesión',
    document: 'Documento',
    audio: 'Audio',
    video: 'Video',
    image: 'Imagen',
    edit: 'Editar',
    delete: 'Eliminar',
    noResources: 'No hay recursos disponibles para tu rol.',
    viewDocument: 'Ver Documento',
    watchVideo: 'Ver Video',
    created: 'Creado',
    salesTrainingPlatform: 'Plataforma de Entrenamiento de Ventas',
    agent: 'Agente',
    admin: 'Administrador',
    loading: 'Cargando...',
    userCreated: 'Usuario creado exitosamente',
    errorCreatingUser: 'Error al crear usuario',
    userUpdated: 'Usuario actualizado exitosamente',
    errorUpdatingUser: 'Error al actualizar usuario',
    userDeleted: 'Usuario eliminado exitosamente',
    errorDeletingUser: 'Error al eliminar usuario',
    confirmDeleteUser: '¿Estás seguro de que quieres eliminar este usuario?',
    resourceCreated: 'Recurso creado exitosamente',
    errorCreatingResource: 'Error al crear recurso',
    categoryNotFound: 'Categoría no encontrada',
    resourceUpdated: 'Recurso actualizado exitosamente',
    errorUpdatingResource: 'Error al actualizar recurso',
    resourceDeleted: 'Recurso eliminado exitosamente',
    errorDeletingResource: 'Error al eliminar recurso',
    confirmDelete: '¿Estás seguro de que quieres eliminar este recurso?',
    cancel: 'Cancelar',
    optional: 'opcional',
    urlHelp: 'Para archivos de Google Drive: comparte el enlace público y pega la URL completa. El sistema intentará reproducirlo automáticamente.',
    lightMode: 'Modo Claro',
    darkMode: 'Modo Oscuro',
    spanish: 'Español',
    portuguese: 'Portugués'
  },
  pt: {
    // Brazilian Portuguese
    login: 'Entrar',
    email: 'E-mail',
    password: 'Senha',
    loginButton: 'Entrar',
    welcome: 'Bem-vindo',
    role: 'Função',
    adminPanel: 'Painel Administrativo',
    manageUsers: 'Gerenciar Usuários',
    manageContent: 'Gerenciar Conteúdo',
    manageCategories: 'Gerenciar Categorias',
    categories: 'Categorias',
    recentResources: 'Recursos Recentes',
    resources: 'Recursos',
    title: 'Título',
    description: 'Descrição',
    type: 'Tipo',
    category: 'Categoria',
    permissions: 'Permissões',
    actions: 'Ações',
    addNewUser: 'Adicionar Novo Usuário',
    name: 'Nome',
    addUser: 'Adicionar Usuário',
    addNewResource: 'Adicionar Novo Recurso',
    url: 'URL',
    allUsers: 'Todos os usuários',
    adminOnly: 'Apenas administradores',
    agentOnly: 'Apenas agentes',
    addResource: 'Adicionar Recurso',
    backToHome: '← Voltar ao Início',
    logout: 'Sair',
    document: 'Documento',
    audio: 'Áudio',
    video: 'Vídeo',
    image: 'Imagem',
    edit: 'Editar',
    delete: 'Excluir',
    noResources: 'Nenhum recurso disponível para sua função.',
    viewDocument: 'Ver Documento',
    watchVideo: 'Assistir Vídeo',
    created: 'Criado',
    salesTrainingPlatform: 'Plataforma de Treinamento de Vendas',
    agent: 'Agente',
    admin: 'Administrador',
    loading: 'Carregando...',
    userCreated: 'Usuário criado com sucesso',
    errorCreatingUser: 'Erro ao criar usuário',
    userUpdated: 'Usuário atualizado com sucesso',
    errorUpdatingUser: 'Erro ao atualizar usuário',
    userDeleted: 'Usuário excluído com sucesso',
    errorDeletingUser: 'Erro ao excluir usuário',
    confirmDeleteUser: 'Tem certeza de que deseja excluir este usuário?',
    resourceCreated: 'Recurso criado com sucesso',
    errorCreatingResource: 'Erro ao criar recurso',
    categoryNotFound: 'Categoria não encontrada',
    resourceUpdated: 'Recurso atualizado com sucesso',
    errorUpdatingResource: 'Erro ao atualizar recurso',
    resourceDeleted: 'Recurso excluído com sucesso',
    errorDeletingResource: 'Erro ao excluir recurso',
    confirmDelete: 'Tem certeza de que deseja excluir este recurso?',
    cancel: 'Cancelar',
    optional: 'opcional',    urlHelp: 'Para arquivos do Google Drive: compartilhe o link público e cole a URL completa. O sistema tentará reproduzi-lo automaticamente.',    lightMode: 'Modo Claro',
    darkMode: 'Modo Escuro',
    spanish: 'Espanhol',
    portuguese: 'Português'
  }
}

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('es')

  useEffect(() => {
    const saved = localStorage.getItem('language')
    if (saved && ['es', 'pt'].includes(saved)) {
      setLanguage(saved)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('language', language)
  }, [language])

  const t = (key) => translations[language][key] || key

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}