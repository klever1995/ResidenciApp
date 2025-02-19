# app/models/comment.rb
class Comment
  include Mongoid::Document
  field :student_id, type: Integer
  field :content, type: String
  field :created_at, type: DateTime, default: ->{ Time.now }

  # Validaciones
  validates :student_id, presence: true
  validates :content, presence: true
end
