RailsAdmin.config do |config|
	config.authorize_with do
	    unless current_user.category == 'admin'
	      redirect_to(
	        '/unauthorized',
	        alert: "You are not permitted to view this page"
	      )
	    end
	  end


  	config.current_user_method { current_user }
end