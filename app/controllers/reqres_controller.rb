class ReqresController < ApplicationController
  before_action :prefetch_users

  def index
    if viewing_user
      id = params[:user]
      load_user(id)
    end
  end

  private

  def prefetch_users
    unless viewing_user
      @prefetch_users = ReqresApi.new.prefetch_users()
    end
  end

  def viewing_user
    return params.has_key?(:user)
  end

  def load_user(id)
    @user = ReqresApi.new.user(id)
  end

  def load_page(id)
    @page = ReqresApi.new.page(id)
  end
end