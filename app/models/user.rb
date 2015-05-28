class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  after_create :add_to_game_status
  has_one :game_status, :dependent => :destroy
  has_many :user_results, :dependent => :destroy

  private
  	def add_to_game_status
      if self.category != 'admin'
        GameStatus.create(user_id: self.id)
      end
  	end
end
