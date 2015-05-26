class HomeController < ApplicationController

  def update_time
    @user = current_user
    @user.time_left = params[:time_left][0]
    @user.time_spent = (7200 - @user.time_left)/60
    @user.save!
    render :json=>{status:"OK"}
  end


  def index
    @user = current_user
    @userTime = @user.time_left
  end


  def save_result

    # render :json => params
    # return

    @user = current_user
    @section = params[:section]
    @question = params[:question]
    @selected_option = params[:selected_option]
    @correct_option = params[:correct_option]
    @option_score = params[:option_score]
    @option_status = params[:option_status]

    @user_res = UserResult.create!(
      :user_id => current_user.id,
      :user_name => current_user.name,
      :section => @section,
      :question => @question,
      :selected_option => @selected_option,
      :correct_option => @correct_option,
      :option_status => @option_status,
      :option_score => @option_score
    )

    @user_res.save!
    @user.total_score = @user.total_score + @user_res.option_score
    @user.save!
    render :json=>{status:"OK"}
    
  end

  def user_selected
    @user = current_user
    @option_selected = params[:option_selected]
    @option_point = params[:option_point]
    render :text => "#{@option_selected}||#{@option_point}"
  end

  def simulation
  end

  def game_complete
    @user = current_user
    @userTime = @user.time_left

    @gs = @user.game_status

    @redirect = false
    @redirectTo = ''

    if !@gs.quinterrogation
      @redirect = true
      if @user.category = 'jr'
        @redirectTo = '/quinterrogation1'
      else
        @redirectTo = '/quinterrogation2'
      end
    end

    if !@gs.msq
      @redirect = true
      @redirectTo = '/msq'
    end

    if !@gs.mcq
      @redirect = true
      @redirectTo = '/mcq'
    end

    if @redirect
      redirect_to(@redirectTo)
    end

  end

  def mcq
    @user = current_user
    @userTime = @user.time_left

    @gs = @user.game_status

    if @gs.mcq
      redirect_to('/msq')
    else
      @gs.mcq = true
      @gs.save 
    end
  end

  def msq
    @user = current_user
    @userTime = @user.time_left

    @gs = @user.game_status

    if @gs.msq
      if @user.category = 'jr'
        redirect_to('/quinterrogation1')
      else
        redirect_to('/quinterrogation2')
      end
    else
      @gs.msq = true
      @gs.save 
    end

  end

  def quinterrogation1
    # for 'junior' users
    @user = current_user
    @userTime = @user.time_left

    @gs = @user.game_status

    if @user.category == 'sr'
      redirect_to('/quinterrogation2')
    else
      if @gs.quinterrogation
        redirect_to('/game_end')
      else
        @gs.quinterrogation = true
        @gs.save
      end
    end  

  end

  def quinterrogation2
    # for 'senior' users
    @user = current_user
    @userTime = @user.time_left

    @gs = @user.game_status

    if @user.category == 'jr'
      redirect_to('/quinterrogation1')
    else
      if @gs.quinterrogation
        redirect_to('/game_end')
      else
        @gs.quinterrogation = true
        @gs.save
      end
    end 

  end

end
