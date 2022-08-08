class ReqresApi
  include HTTParty
  base_uri "https://reqres.in/api/users"
  format :json
  attr_reader :response

  def prefetch_users
    @response = self.class.get("#{self.class.base_uri}").parsed_response
  end

  def formatted_prefetch
    @prefetch = prefetch_users
    @prefetch_users = []
    page_count = total_pages
    i = 1
    while i <= page_count do
      page = page(i)
      page['data'].each { |user|
        @prefetch_users.push({ id: user['id'], avatar: user['avatar'], email: user['email'], first_name: user['first_name'], last_name: user['last_name'] })
      }
      i += 1
    end
    return @prefetch_users
  end

  def per_page
    per_page = prefetch_users['per_page']
  end

  def total_pages
    total_pages = prefetch_users['total_pages']
  end

  def page(id = 1)
    @response = self.class.get("#{self.class.base_uri}?page=#{id}").parsed_response
  end

  def user(id)
    @response = self.class.get("#{self.class.base_uri}/#{id}").parsed_response
  end
end