class ReqresController < ApplicationController
  before_action :prefetch_users, :pagination

  def index
  end

  def user
    id = params[:id]
    load_user(id)
  end

  private

  def prefetch_users
    unless viewing_user
      @prefetch_users = ReqresApi.new.formatted_prefetch()
    end
  end

  def pagination
    unless viewing_user
      @total_pages = ReqresApi.new.total_pages()
      @per_page = ReqresApi.new.per_page()
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