# app/controllers/comments_controller.rb
class CommentsController < ApplicationController
  before_action :set_comment, only: [:show]

  # Crear un nuevo comentario
  def create
    comment = Comment.new(comment_params)
    
    if comment.save
      render json: { message: "Comentario creado exitosamente", comment: comment }, status: :created
    else
      render json: { errors: comment.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # Obtener un comentario por ID
  def show
    render json: @comment
  end

  private

  def set_comment
    @comment = Comment.find(params[:id])
  rescue Mongoid::Errors::DocumentNotFound
    render json: { message: "Comentario no encontrado" }, status: :not_found
  end

  def comment_params
    params.require(:comment).permit(:student_id, :content)
  end
end
