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




  	config.actions do
		# root actions
	    dashboard # mandatory

	    # collection actions
	    index # mandatory
	    new
	    export
	    import
	    history_index
	    bulk_delete

	    # member actions
	    show
	    edit
	    delete
	    history_show
	    show_in_app
	end
end