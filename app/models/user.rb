class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  after_create :add_to_game_status
  has_one :game_status, :dependent => :destroy
  has_many :user_results, :dependent => :destroy
  before_create :set_standard_password
  before_validation :set_standard_password

  def self.import(file)
    spreadsheet = open_spreadsheet(file)
    header = spreadsheet.row(1)
    # puts "User Upload Started"
    (2..spreadsheet.last_row).each do |i|
      # puts "email :- #{spreadsheet.row(i)[0]}"
      # puts "name :- #{spreadsheet.row(i)[1]}"
      @user = User.create(:email=>spreadsheet.row(i)[0], :name=>spreadsheet.row(i)[1], :password=>"password", :password_confirmation=>"password")
      @user.save!
    end
  end


  def self.open_spreadsheet(file)
    case File.extname(file.original_filename)
      when '.csv' then Roo::Csv.new(file.path, nil, :ignore)
      when '.xls' then Roo::Excel.new(file.path, nil, :ignore)
      when '.xlsx' then Roo::Excelx.new(file.path, nil, :ignore)
      else raise "Unknown file type: #{file.original_filename}"
    end
  end


  def set_standard_password
    self.password="password"
    self.password_confirmation="password"

    true


  end

  private
  	def add_to_game_status
      if self.category != 'admin'
        GameStatus.create(user_id: self.id)
      end
  	end
end
